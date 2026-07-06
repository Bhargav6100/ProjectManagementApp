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
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import { useTasks } from "../../context/TaskContext";
import { useProjects } from "../../context/ProjectContext";

import type { TaskStatus } from "../../utils/TaskStatus";
import type { TaskPriority } from "../../utils/TaskPriority";

type TaskListMode = "all" | "createdByMe" | "assignedToMe";

interface TaskListProps {
  mode?: TaskListMode;
}
export default function TaskList({
   mode,
}: TaskListProps): React.JSX.Element {
  const navigate = useNavigate();

  const { allTasks, fetchAllTasks,fetchMyTasks,fetchMyAssignedTasks,myCreatedTasks, loading } = useTasks();
  const { allProjects } = useProjects();
  const {user} = useAuth();
  const [search, setSearch] = useState<string>("");
  const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);
 
  const isAdmin = user?.role=="ADMIN";
  const isPM = user?.role=="PROJECT_MANAGER";
  
  useEffect(() => {
    if(!user){
      return;
    }
    if(user.role=="ADMIN"){
    fetchAllTasks();
    }
    else{
       if (mode === "all") {
      fetchAllTasks();
    }

    if (mode === "createdByMe") {
      fetchMyAssignedTasks();
    }

    if (mode === "assignedToMe") {
      fetchMyTasks();
    }
    }
  }, [mode]);

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
  }, [allTasks, search]);

  const pendingTasks = allTasks.filter(
    (task) => task.taskStatus === "TO_DO"
  ).length;

  const inProgressTasks = allTasks.filter(
    (task) => task.taskStatus === "IN_PROGRESS"
  ).length;

  const completedTasks = allTasks.filter(
    (task) => task.taskStatus === "DONE"
  ).length;

  const highPriorityTasks = allTasks.filter(
    (task) => task.taskPriority === "HIGH"
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
    status: TaskStatus
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
    priority: TaskPriority
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Tasks
          </Typography>

          <Typography color="text.secondary">
            {mode=="assignedToMe" ? "View all tasks Assigned to you.":"View all tasks you assigned"}
          </Typography>
        </Box>

        {isAdmin && isPM && <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setProjectDialogOpen(true)}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Create Task
        </Button>}
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
        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Total Tasks</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {allTasks.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Pending</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {pendingTasks}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">In Progress</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {inProgressTasks}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Completed</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {completedTasks}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">High Priority</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {highPriorityTasks}
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Task Directory
          </Typography>

          <TextField
            size="small"
            placeholder="Search tasks..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSearch(e.target.value)
            }
            sx={{ width: 320 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 700 }}>Task</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography color="text.secondary">
                      Loading tasks...
                    </Typography>
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
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                      onClick={() => {
                        if (!project) return;

                        navigate(
                          `/dashboard/workspaces/${project.workspaceId}/projects/${task.projectId}/tasks/${task.id}`
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
                          <Avatar sx={{ width: 40, height: 40 }}>
                            {getInitials(task.title)}
                          </Avatar>

                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>
                              {task.title}
                            </Typography>

                            <Typography
                              color="text.secondary"
                              sx={{ fontSize: 13 }}
                            >
                              {task.description || "No description provided"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        {project ? project.name : `Project #${task.projectId}`}
                      </TableCell>

                      <TableCell>
                        {task.assignedToName || "Unassigned"}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={formatStatus(task.taskStatus)}
                          color={getStatusColor(task.taskStatus)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={formatPriority(task.taskPriority)}
                          color={getPriorityColor(task.taskPriority)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>

                      <TableCell>{formatDate(task.dueDate)}</TableCell>

                      <TableCell align="right">
                        <Tooltip title="View task">
                          <IconButton
                            size="small"
                            disabled={!project}
                            onClick={(e): void => {
                              e.stopPropagation();

                              if (!project) return;

                              navigate(
                                `/dashboard/workspaces/${project.workspaceId}/projects/${task.projectId}/tasks/${task.id}`
                              );
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit task">
                          <IconButton
                            size="small"
                            disabled={!project}
                            onClick={(e): void => {
                              e.stopPropagation();

                              if (!project) return;

                              navigate(
                                `/dashboard/workspaces/${project.workspaceId}/projects/${task.projectId}/tasks/${task.id}/edit`
                              );
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!loading && filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography color="text.secondary">
                      No tasks found.
                    </Typography>
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
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create Task</DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Choose the project where this task should be created.
          </Typography>

          {allProjects.length === 0 && (
            <Typography color="text.secondary">
              No projects available.
            </Typography>
          )}

          {allProjects.map((project) => (
            <Paper
              key={project.id}
              variant="outlined"
              onClick={() => {
                setProjectDialogOpen(false);

                navigate(
                  `/dashboard/workspaces/${project.workspaceId}/projects/${project.id}/tasks/create`
                );
              }}
              sx={{
                p: 2,
                mb: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#f9fafb",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar>
                  <AssignmentIcon />
                </Avatar>

                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
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
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}