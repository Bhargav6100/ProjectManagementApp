import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BadgeIcon from "@mui/icons-material/Badge";

import { useSnackbar } from "../../context/SnackbarContext";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import type { TaskStatus } from "../../utils/TaskStatus";
import type { TaskPriority } from "../../utils/TaskPriority";

export default function TaskDetails(): React.JSX.Element {
  const { workspaceId, projectId, taskId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { currentTask, fetchTaskById, deleteTask, loading } = useTasks();

  const isAdmin = user?.role === "ADMIN";
  const isPM = user?.role === "PROJECT_MANAGER";
  const isMember = user?.role === "MEMBER";
  const isTaskCreator = currentTask?.createdBy?.toLowerCase() === user?.firstName?.toLowerCase() + " " + user?.lastName?.toLowerCase();
  console.log(currentTask?.createdBy)
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (taskId) {
      fetchTaskById(Number(taskId));
    }
  }, [taskId]);

  
const handleEditTask = (): void => {
  if (!currentTask) return;

  if (!isAdmin && !isTaskCreator) {
    showSnackbar("Only the task creator or admin can edit this task.", "warning");
    return;
  }

  navigate(
    `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${currentTask.id}/edit`
  );
};
  const handleDeleteTask = async (): Promise<void> => {
  if (!currentTask) return;


  if (!isAdmin && !isTaskCreator) {
    showSnackbar("Only the task creator or admin can delete this task.", "warning");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmed) return;

  try {
    await deleteTask(currentTask.id);

    showSnackbar("Task deleted successfully.", "success");

    navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`);
  } catch (error) {
    showSnackbar("You are not allowed to delete this task.", "error");
  }
};

  const formatStatus = (status: TaskStatus): string => {
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

  const formatDate = (date?: string): string => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString();
  };

  const formatDateTime = (date?: string): string => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
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
          <Typography color="text.secondary">Loading task...</Typography>
        </Paper>
      </Box>
    );
  }

  if (!currentTask) {
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
            <TaskAltIcon />
          </Avatar>

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Task not found
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            The selected task could not be loaded.
          </Typography>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
            }}
            onClick={() =>
              navigate(
                `/dashboard/workspaces/${workspaceId}/projects/${projectId}`
              )
            }
          >
            Back to Project
          </Button>
        </Paper>
      </Box>
    );
  }

  const assignedTo = currentTask.assignedToName
    ? currentTask.assignedToName
    : `User ID: ${currentTask.assignedToUserId}`;

  const statCards = [
    {
      label: "Status",
      value: formatStatus(currentTask.taskStatus),
      helper: "Current progress",
      icon: <AssignmentIcon />,
    },
    {
      label: "Priority",
      value: formatPriority(currentTask.taskPriority),
      helper: "Task urgency",
      icon: <PriorityHighIcon />,
    },
    {
      label: "Assigned To",
      value: assignedTo,
      helper: "Responsible member",
      icon: <PersonIcon />,
    },
    {
      label: "Due Date",
      value: formatDate(currentTask.dueDate),
      helper: "Expected completion",
      icon: <CalendarMonthIcon />,
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
            onClick={() =>
              navigate(
                `/dashboard/workspaces/${workspaceId}/projects/${projectId}`
              )
            }
          >
            Back to Project
          </Button>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Task Details
          </Typography>

          <Typography color="text.secondary">
            View task information, assignment, due date, and priority.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {(isAdmin || isPM || isTaskCreator) && (
  <Button
    variant="outlined"
    startIcon={<EditIcon />}
    sx={{
      borderRadius: 2,
      textTransform: "none",
      px: 3,
      fontWeight: 700,
    }}
    onClick={handleEditTask}
  >
    Edit Task
  </Button>
)}

          {(isMember || (isPM && !isTaskCreator)) && (
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
                  `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${currentTask.id}/edit`
                )
              }
            >
              Edit Task Status
            </Button>
          )}

          {(isAdmin || isPM) && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                fontWeight: 700,
                boxShadow: "0 10px 25px rgba(220, 38, 38, 0.22)",
              }}
              onClick={() => {
                void handleDeleteTask();
              }}
            >
              Delete Task
            </Button>
          )}
        </Box>
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
                fontSize: 28,
                fontWeight: 800,
                bgcolor: "#e0e7ff",
                color: "#3730a3",
              }}
            >
              {getInitials(currentTask.title)}
            </Avatar>

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {currentTask.title}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {currentTask.description || "No description provided."}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
                <Chip
                  label={formatStatus(currentTask.taskStatus)}
                  color={getStatusColor(currentTask.taskStatus)}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                />

                <Chip
                  label={formatPriority(currentTask.taskPriority)}
                  color={getPriorityColor(currentTask.taskPriority)}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                />
              </Box>
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
              Task ID
            </Typography>

            <Typography sx={{ fontWeight: 800 }}>#{currentTask.id}</Typography>
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

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 13, fontWeight: 600 }}
                >
                  {card.label}
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    mt: 0.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
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
              Task Information
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Basic task details and assignment information.
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
              Task Title
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>{currentTask.title}</Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Assigned To
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>{assignedTo}</Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Status
            </Typography>

            <Chip
              label={formatStatus(currentTask.taskStatus)}
              color={getStatusColor(currentTask.taskStatus)}
              size="small"
              sx={{ mt: 0.5, fontWeight: 700, borderRadius: 2 }}
            />
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Priority
            </Typography>

            <Chip
              label={formatPriority(currentTask.taskPriority)}
              color={getPriorityColor(currentTask.taskPriority)}
              size="small"
              sx={{ mt: 0.5, fontWeight: 700, borderRadius: 2 }}
            />
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Due Date
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {formatDate(currentTask.dueDate)}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Project ID
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              #{currentTask.projectId}
            </Typography>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 1", md: "span 2" } }}>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Description
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {currentTask.description || "No description provided."}
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
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Task Metadata
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            System-level task tracking information.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              borderColor: "#e5e7eb",
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
                <FolderIcon />
              </Avatar>

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Project ID
                </Typography>

                <Typography sx={{ fontWeight: 800 }}>
                  #{currentTask.projectId}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              borderColor: "#e5e7eb",
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
                <BadgeIcon />
              </Avatar>

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Created By
                </Typography>

                <Typography sx={{ fontWeight: 800 }}>
                  {currentTask.createdBy}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              borderColor: "#e5e7eb",
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
                <CalendarMonthIcon />
              </Avatar>

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Created At
                </Typography>

                <Typography sx={{ fontWeight: 800 }}>
                  {formatDateTime(currentTask.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            This task belongs to project #{currentTask.projectId}. Use the edit
            action to update task details or status based on your role.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}