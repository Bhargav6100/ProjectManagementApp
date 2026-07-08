import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../context/TaskContext";
import { useProjects } from "../../context/ProjectContext";
import type { TaskStatus } from "../../utils/TaskStatus";
import type { TaskPriority } from "../../utils/TaskPriority";
type TaskListMode = "all" | "createdByMe" | "assignedToMe";
interface TaskListProps {
  mode?: TaskListMode;
}
export default function TaskList({
  mode = "all",
}: TaskListProps): React.JSX.Element {
  const navigate = useNavigate();
  const {
    allTasks,
    fetchAllTasks,
    fetchMyTasks,
    fetchMyAssignedTasks,
    myCreatedTasks,
    deleteTask,
    loading,
  } = useTasks();
  const { allProjects } = useProjects();
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);
  const isAdmin = user?.role === "ADMIN";
  const isPM = user?.role === "PROJECT_MANAGER";
  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.role === "ADMIN") {
      fetchAllTasks();
      return;
    }
    if (mode === "all") {
      fetchAllTasks();
    }
    if (mode === "createdByMe") {
      fetchMyAssignedTasks();
    }
    if (mode === "assignedToMe") {
      fetchMyTasks();
    }
  }, [user, mode]);
  const displayedTasks = useMemo(() => {
    if (mode === "createdByMe") {
      return myCreatedTasks;
    }
    return allTasks;
  }, [mode, allTasks, myCreatedTasks]);
  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase();
    return displayedTasks.filter((task) => {
      const title = task.title.toLowerCase();
      const description = task.description?.toLowerCase() ?? "";
      const assignedToName = task.assignedToName?.toLowerCase() ?? "";
      const status = task.taskStatus.toLowerCase();
      const priority = task.taskPriority.toLowerCase();
      const createdBy = task.createdBy?.toLowerCase() ?? "";
      return (
        title.includes(query) ||
        description.includes(query) ||
        assignedToName.includes(query) ||
        status.includes(query) ||
        priority.includes(query) ||
        createdBy.includes(query)
      );
    });
  }, [displayedTasks, search]);
  const pendingTasks = displayedTasks.filter(
    (task) => task.taskStatus === "TO_DO",
  ).length;
  const inProgressTasks = displayedTasks.filter(
    (task) => task.taskStatus === "IN_PROGRESS",
  ).length;
  const completedTasks = displayedTasks.filter(
    (task) => task.taskStatus === "DONE",
  ).length;
  const highPriorityTasks = displayedTasks.filter(
    (task) => task.taskPriority === "HIGH",
  ).length;
  const getProjectById = (projectId: number) => {
    return allProjects.find((project) => project.id === projectId);
  };
  const formatStatus = (status: TaskStatus): string => {
    if (status === "TO_DO") {
      return "Pending";
    }
    if (status === "IN_PROGRESS") {
      return "In Progress";
    }
    if (status === "DONE") {
      return "Completed";
    }
    return status;
  };
  const getStatusColor = (
    status: TaskStatus,
  ): "warning" | "info" | "success" | "default" => {
    if (status === "TO_DO") {
      return "warning";
    }
    if (status === "IN_PROGRESS") {
      return "info";
    }
    if (status === "DONE") {
      return "success";
    }
    return "default";
  };
  const formatPriority = (priority: TaskPriority): string => {
    if (priority === "LOW") {
      return "Low";
    }
    if (priority === "MEDIUM") {
      return "Medium";
    }
    if (priority === "HIGH") {
      return "High";
    }
    return priority;
  };
  const getPriorityColor = (
    priority: TaskPriority,
  ): "default" | "warning" | "error" => {
    if (priority === "HIGH") {
      return "error";
    }
    if (priority === "MEDIUM") {
      return "warning";
    }
    return "default";
  };
  const getInitials = (name?: string): string => {
    if (!name || name.trim() === "") {
      return "?";
    }
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };
  const formatDate = (date?: string): string => {
    if (!date) {
      return "N/A";
    }
    return new Date(date).toLocaleDateString();
  };
  const handleDeleteTask = async (
    e: React.MouseEvent<HTMLButtonElement>,
    taskId: number,
  ): Promise<void> => {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );
    if (!confirmed) {
      return;
    }
    await deleteTask(taskId);
    if (!user) {
      return;
    }
    if (user.role === "ADMIN") {
      await fetchAllTasks();
      return;
    }
    if (mode === "createdByMe") {
      await fetchMyAssignedTasks();
      return;
    }
    if (mode === "assignedToMe") {
      await fetchMyTasks();
      return;
    }
    await fetchAllTasks();
  };
  const pageDescription =
    mode === "assignedToMe"
      ? "View and manage all tasks assigned to you."
      : mode === "createdByMe"
        ? "View and manage all tasks created by you."
        : "View and manage all tasks across your projects.";
  const statCards = [
    {
      label: "Total Tasks",
      value: displayedTasks.length,
      helper: "All visible tasks",
    },
    { label: "Pending", value: pendingTasks, helper: "Tasks not started" },
    {
      label: "In Progress",
      value: inProgressTasks,
      helper: "Currently active",
    },
    { label: "Completed", value: completedTasks, helper: "Finished tasks" },
    {
      label: "High Priority",
      value: highPriorityTasks,
      helper: "Needs attention",
    },
  ];
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Tasks
          </Typography>
          <Typography color="text.secondary">{pageDescription}</Typography>
        </Box>
        {(isAdmin || isPM) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setProjectDialogOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1,
              fontWeight: 700,
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
            }}
          >
            Create Task
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {statCards.map((card) => (
          <Paper
            key={card.label}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
              transition: "0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 16px 35px rgba(15, 23, 42, 0.1)",
              },
            }}
          >
            <Typography
              color="text.secondary"
              sx={{ fontSize: 13, fontWeight: 600 }}
            >
              {card.label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              {card.value}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.5 }}>
              {card.helper}
            </Typography>
          </Paper>
        ))}
      </Box>
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by task, description, assignee, status, priority or creator..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setSearch(e.target.value)
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#f9fafb" },
          }}
        />
      </Paper>
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Task Directory
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Showing {filteredTasks.length} of {displayedTasks.length}
              tasks
            </Typography>
          </Box>
          <Chip
            label={`${filteredTasks.length} Results`}
            size="small"
            sx={{ fontWeight: 700, bgcolor: "#eef2ff", color: "#3730a3" }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 800 }}>Task</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Due Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ py: 3, textAlign: "center" }}>
                      <Typography color="text.secondary">
                        Loading tasks...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                filteredTasks.map((task) => {
                  const project = getProjectById(task.projectId);
                  return (
                    <TableRow
                      key={task.id}
                      hover
                      sx={{
                        cursor: "pointer",
                        transition: "0.2s ease",
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": { bgcolor: "#f8fafc" },
                      }}
                      onClick={() => {
                        if (!project) return;
                        navigate(
                          `/dashboard/workspaces/${project.workspaceId}/projects/${task.projectId}/tasks/${task.id}`,
                        );
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              fontWeight: 800,
                              bgcolor: "#e0e7ff",
                              color: "#3730a3",
                            }}
                          >
                            {getInitials(task.title)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                              {task.title}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              sx={{
                                fontSize: 13,
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {task.description || "No description provided"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          {project
                            ? project.name
                            : `Project #${task.projectId}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: 14 }}
                        >
                          {task.assignedToName || "Unassigned"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(task.taskStatus)}
                          color={getStatusColor(task.taskStatus)}
                          size="small"
                          sx={{ fontWeight: 700, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatPriority(task.taskPriority)}
                          color={getPriorityColor(task.taskPriority)}
                          size="small"
                          sx={{ fontWeight: 700, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: 14 }}
                        >
                          {formatDate(task.dueDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="View task">
                            <span>
                              <IconButton
                                size="small"
                                disabled={!project}
                                onClick={(e): void => {
                                  e.stopPropagation();
                                  if (!project) return;
                                  navigate(
                                    `/dashboard/workspaces/${project.workspaceId}/projects/${task.projectId}/tasks/${task.id}`,
                                  );
                                }}
                                sx={{
                                  bgcolor: "#f1f5f9",
                                  "&:hover": { bgcolor: "#e2e8f0" },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Edit task">
                            <span>
                              <IconButton
                                size="small"
                                disabled={!project}
                                onClick={(e): void => {
                                  e.stopPropagation();
                                  if (!project) return;
                                  navigate(
                                    `/dashboard/workspaces/${project.workspaceId}/projects/${task.projectId}/tasks/${task.id}/edit`,
                                  );
                                }}
                                sx={{
                                  bgcolor: "#f1f5f9",
                                  "&:hover": { bgcolor: "#e2e8f0" },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          {(isAdmin || isPM) && (
                            <Tooltip title="Delete task">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e): void => {
                                  void handleDeleteTask(e, task.id);
                                }}
                                sx={{
                                  bgcolor: "#fef2f2",
                                  "&:hover": { bgcolor: "#fee2e2" },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {!loading && filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ py: 5, textAlign: "center" }}>
                      <Avatar
                        sx={{
                          mx: "auto",
                          mb: 1.5,
                          width: 48,
                          height: 48,
                          bgcolor: "#f1f5f9",
                          color: "#64748b",
                        }}
                      >
                        <AssignmentIcon />
                      </Avatar>
                      <Typography sx={{ fontWeight: 700 }}>
                        No tasks found
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                        Try adjusting your search keyword.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Create Task</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Choose the project where this task should be created.
          </Typography>
          {allProjects.length === 0 && (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Avatar
                sx={{
                  mx: "auto",
                  mb: 1.5,
                  width: 48,
                  height: 48,
                  bgcolor: "#f1f5f9",
                  color: "#64748b",
                }}
              >
                <AssignmentIcon />
              </Avatar>
              <Typography sx={{ fontWeight: 700 }}>
                No projects available
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Create or assign a project before creating a task.
              </Typography>
            </Box>
          )}
          {allProjects.map((project) => (
            <Paper
              key={project.id}
              variant="outlined"
              onClick={() => {
                setProjectDialogOpen(false);
                navigate(
                  `/dashboard/workspaces/${project.workspaceId}/projects/${project.id}/tasks/create`,
                );
              }}
              sx={{
                p: 2,
                mb: 1.5,
                borderRadius: 2.5,
                cursor: "pointer",
                transition: "0.2s ease",
                borderColor: "#e5e7eb",
                "&:hover": {
                  bgcolor: "#f8fafc",
                  borderColor: "#c7d2fe",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "#e0e7ff", color: "#3730a3" }}>
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>
                    {project.name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    Workspace ID: {project.workspaceId}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setProjectDialogOpen(false)}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
