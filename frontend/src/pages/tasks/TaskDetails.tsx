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

import { useTasks } from "../../context/TaskContext";
import type { TaskStatus } from "../../utils/TaskStatus";
import type { TaskPriority } from "../../utils/TaskPriority";

export default function TaskDetails(): React.JSX.Element {
  const { workspaceId, projectId, taskId } = useParams();
  const navigate = useNavigate();

  const { currentTask, fetchTaskById, loading } = useTasks();

  useEffect(() => {
    if (taskId) {
      fetchTaskById(Number(taskId));
    }
  }, [taskId]);

  const formatStatus = (status: TaskStatus): string => {
    if (status === "TO_DO") {
      return "To Do";
    }

    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    return "Done";
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

  if (loading) {
    return (
      <Box>
        <Typography>Loading task...</Typography>
      </Box>
    );
  }

  if (!currentTask) {
    return (
      <Box>
        <Typography color="error">Task not found.</Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2, textTransform: "none" }}
          onClick={() =>
            navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`)
          }
        >
          Back to Project
        </Button>
      </Box>
    );
  }

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
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 1, textTransform: "none" }}
            onClick={() =>
              navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`)
            }
          >
            Back to Project
          </Button>

          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Task Details
          </Typography>

          <Typography color="text.secondary">
            View task information, assignment, due date, and priority.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          onClick={() =>
            navigate(
              `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${currentTask.id}/edit`
            )
          }
        >
          Edit Task
        </Button>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64 }}>
            <TaskAltIcon fontSize="large" />
          </Avatar>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {currentTask.title}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              <Chip
                label={formatStatus(currentTask.status)}
                color={getStatusColor(currentTask.status)}
                size="small"
                sx={{ fontWeight: 600 }}
              />

              <Chip
                label={currentTask.priority}
                color={getPriorityColor(currentTask.priority)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>
            Description
          </Typography>

          <Typography color="text.secondary">
            {currentTask.description || "No description provided."}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PersonIcon color="primary" />

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Assigned To
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  {currentTask.assignedToName
                    ? currentTask.assignedToName
                    : `User ID: ${currentTask.assignedToUserId}`}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarMonthIcon color="primary" />

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Due Date
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  {new Date(currentTask.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PriorityHighIcon color="primary" />

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Priority
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  {currentTask.priority}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Task Metadata
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FolderIcon color="primary" />

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Project ID
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  {currentTask.projectId}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PersonIcon color="primary" />

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Created By
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  {currentTask.createdBy}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarMonthIcon color="primary" />

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Created At
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  {new Date(currentTask.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}