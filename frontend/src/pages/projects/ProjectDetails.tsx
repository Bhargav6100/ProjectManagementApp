import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FlagIcon from "@mui/icons-material/Flag";
import AddIcon from "@mui/icons-material/Add";

import { useProjects } from "../../context/ProjectContext";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";
import type { ProjectStatus } from "../../utils/ProjectStatus";

export default function ProjectDetails(): React.JSX.Element {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();

  const { currentProject, fetchProjectById, loading, deleteProject } =
    useProjects();

  const { tasks, fetchTasksByProject, deleteTask } = useTasks();

  const { user } = useAuth();

  const {showSnackbar} = useSnackbar();

  const isAdmin = user?.role === "ADMIN";
  const isPM = user?.role === "PROJECT_MANAGER";

  useEffect(() => {
    if (projectId) {
      fetchProjectById(Number(projectId));
      fetchTasksByProject(Number(projectId));
    }
  }, [projectId]);

  const handleDeleteProject = async (): Promise<void> => {
    if (!projectId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await deleteProject(Number(projectId));
      navigate("/dashboard/projects", { replace: true });
    } catch (error) {
      showSnackbar("Failed to delete project.");
    }
  };

  const handleDeleteTask = async (
    e: React.MouseEvent<HTMLButtonElement>,
    taskId: number
  ): Promise<void> => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    await deleteTask(taskId);

    if (projectId) {
      await fetchTasksByProject(Number(projectId));
    }
  };

  const formatStatus = (status: ProjectStatus): string => {
    if (status === "ACTIVE") {
      return "active";
    }

    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const getStatusColor = (
    status: ProjectStatus
  ): "success" | "warning" | "default" => {
    if (status === "COMPLETE") {
      return "success";
    }

    if (status === "ACTIVE") {
      return "warning";
    }

    return "default";
  };

  const formatTaskStatus = (status: string): string => {
    if (status === "TO_DO") {
      return "To Do";
    }

    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    if (status === "DONE") {
      return "Done";
    }

    return status;
  };

  const getTaskStatusColor = (
    status: string
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

  const getPriorityColor = (
    priority: string
  ): "success" | "warning" | "error" | "default" => {
    if (priority === "LOW") {
      return "success";
    }

    if (priority === "MEDIUM") {
      return "warning";
    }

    if (priority === "HIGH") {
      return "error";
    }

    return "default";
  };

  const formatPriority = (priority: string): string => {
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

  const formatDate = (date?: string): string => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
  };

  const formatShortDate = (date?: string): string => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString();
  };

  const getInitials = (value?: string): string => {
    if (!value || value.trim() === "") {
      return "?";
    }

    return value
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Typography color="text.secondary">Loading project...</Typography>
        </Paper>
      </Box>
    );
  }

  if (!currentProject) {
    return (
      <Box>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mx: "auto",
              mb: 2,
              bgcolor: "#f1f5f9",
              color: "#64748b",
            }}
          >
            <FolderIcon />
          </Avatar>

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Project not found
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            The selected project could not be loaded.
          </Typography>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
            }}
            onClick={() => navigate("/dashboard/projects")}
          >
            Back to Projects
          </Button>
        </Paper>
      </Box>
    );
  }

  const resolvedWorkspaceId = workspaceId ?? String(currentProject.workspaceId);

  const todoTasks = tasks.filter((task) => task.taskStatus === "TO_DO").length;

  const inProgressTasks = tasks.filter(
    (task) => task.taskStatus === "IN_PROGRESS"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.taskStatus === "DONE"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.taskPriority === "HIGH"
  ).length;

  const statCards = [
    {
      label: "Total Tasks",
      value: tasks.length,
      helper: "Connected tasks",
      icon: <TaskAltIcon />,
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      helper: "Currently active",
      icon: <AssignmentIcon />,
    },
    {
      label: "Completed",
      value: completedTasks,
      helper: "Finished tasks",
      icon: <TaskAltIcon />,
    },
    {
      label: "High Priority",
      value: highPriorityTasks,
      helper: "Needs attention",
      icon: <FlagIcon />,
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
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 1,
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
            }}
            onClick={() => navigate("/dashboard/projects")}
          >
            Back to Projects
          </Button>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Project Details
          </Typography>

          <Typography color="text.secondary">
            View project information, status, and related tasks.
          </Typography>
        </Box>

        {(isAdmin || isPM) && (
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                fontWeight: 700,
              }}
              onClick={() =>
                navigate(
                  `/dashboard/workspaces/${resolvedWorkspaceId}/projects/${currentProject.id}/edit`
                )
              }
            >
              Edit Project
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                fontWeight: 700,
              }}
              onClick={() => {
                void handleDeleteProject();
              }}
            >
              Delete Project
            </Button>

            <Button
              variant="contained"
              startIcon={<TaskAltIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                fontWeight: 700,
                boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
              }}
              onClick={() =>
                navigate(
                  `/dashboard/workspaces/${resolvedWorkspaceId}/projects/${currentProject.id}/tasks/create`
                )
              }
            >
              Create Task
            </Button>
          </Box>
        )}
      </Box>

      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          mb: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 76,
                height: 76,
                bgcolor: "#e0e7ff",
                color: "#3730a3",
              }}
            >
              <FolderIcon fontSize="large" />
            </Avatar>

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {currentProject.name}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {currentProject.description || "No description provided."}
              </Typography>

              <Chip
                label={formatStatus(currentProject.status)}
                color={getStatusColor(currentProject.status)}
                sx={{
                  mt: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: "#f8fafc",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Project ID
            </Typography>

            <Typography sx={{ fontWeight: 800 }}>
              #{currentProject.id}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "#eef2ff",
                  color: "#3730a3",
                }}
              >
                {card.icon}
              </Avatar>

              <Box>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 13, fontWeight: 600 }}
                >
                  {card.label}
                </Typography>

                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.3 }}>
                  {card.value}
                </Typography>

                <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                  {card.helper}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          mb: 3,
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
              Project Information
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Basic project details and ownership information.
            </Typography>
          </Box>

          <Chip
            label="Overview"
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: "#eef2ff",
              color: "#3730a3",
            }}
          />
        </Box>

        <Box
          sx={{
            p: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2.5,
          }}
        >
          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Project Name
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {currentProject.name}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Status
            </Typography>

            <Chip
              label={formatStatus(currentProject.status)}
              color={getStatusColor(currentProject.status)}
              size="small"
              sx={{ mt: 0.5, fontWeight: 700, borderRadius: 2 }}
            />
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Created By
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {currentProject.createdBy}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Created At
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {formatDate(currentProject.createdAt)}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Workspace ID
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              #{currentProject.workspaceId}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Pending Tasks
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>{todoTasks}</Typography>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 1", md: "span 2" } }}>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Description
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {currentProject.description || "No description provided."}
            </Typography>
          </Box>
        </Box>
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
              Project Tasks
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Tasks connected to this project.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`${tasks.length} Tasks`}
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: "#eef2ff",
                color: "#3730a3",
              }}
            />

            {(isAdmin || isPM) && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                }}
                onClick={() =>
                  navigate(
                    `/dashboard/workspaces/${resolvedWorkspaceId}/projects/${currentProject.id}/tasks/create`
                  )
                }
              >
                Add Task
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {tasks.length === 0 ? (
            <Box
              sx={{
                border: "1px dashed #d1d5db",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                bgcolor: "#f9fafb",
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 1.5,
                  bgcolor: "#f1f5f9",
                  color: "#64748b",
                }}
              >
                <TaskAltIcon />
              </Avatar>

              <Typography sx={{ fontWeight: 800 }}>No tasks found</Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {(isAdmin || isPM)
                  ? "Create your first task inside this project."
                  : "There are no tasks connected to this project yet."}
              </Typography>

              {(isAdmin || isPM) && (
                <Button
                  variant="contained"
                  startIcon={<TaskAltIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 700,
                    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
                  }}
                  onClick={() =>
                    navigate(
                      `/dashboard/workspaces/${resolvedWorkspaceId}/projects/${currentProject.id}/tasks/create`
                    )
                  }
                >
                  Create Task
                </Button>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {tasks.map((task) => (
                <Paper
                  key={task.id}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    cursor: "pointer",
                    borderColor: "#e5e7eb",
                    transition: "0.2s ease",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                      borderColor: "#c7d2fe",
                      transform: "translateY(-3px)",
                      boxShadow: "0 16px 35px rgba(15, 23, 42, 0.1)",
                    },
                  }}
                  onClick={() =>
                    navigate(
                      `/dashboard/workspaces/${resolvedWorkspaceId}/projects/${currentProject.id}/tasks/${task.id}`
                    )
                  }
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          fontWeight: 800,
                          bgcolor: "#e0e7ff",
                          color: "#3730a3",
                        }}
                      >
                        {getInitials(task.title)}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {task.title}
                        </Typography>

                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                          Assigned to{" "}
                          {task.assignedToName
                            ? task.assignedToName
                            : `User ID: ${task.assignedToUserId}`}
                        </Typography>
                      </Box>
                    </Box>

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
                            "&:hover": {
                              bgcolor: "#fee2e2",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      minHeight: 42,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {task.description || "No description provided."}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        size="small"
                        label={formatTaskStatus(task.taskStatus)}
                        color={getTaskStatusColor(task.taskStatus)}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />

                      <Chip
                        size="small"
                        label={formatPriority(task.taskPriority)}
                        color={getPriorityColor(task.taskPriority)}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.7,
                      }}
                    >
                      <CalendarMonthIcon fontSize="small" color="disabled" />

                      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                        Due Date: {formatShortDate(task.dueDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}