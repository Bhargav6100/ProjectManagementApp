import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { createTask } from "../../services/taskServices";
import type { TaskStatus } from "../../utils/TaskStatus";
import type { TaskPriority } from "../../utils/TaskPriority";
import { useWorkspaces } from "../../context/WorkspaceContext";

export default function TaskForm(): React.JSX.Element {
  const navigate = useNavigate();
  const { workspaceId, projectId } = useParams();

  const { members } = useWorkspaces();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [assignedToUserId, setAssignedToUserId] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("TO_DO");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("MEDIUM");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!projectId) {
      alert("Project id is missing");
      return;
    }

    if (!assignedToUserId) {
      alert("Please assign this task to a user");
      return;
    }

    try {
      setSubmitting(true);

      await createTask(Number(projectId), {
        title,
        description,
        dueDate,
        assignedToUserId: Number(assignedToUserId),
        taskStatus,
        taskPriority,
      });

      alert("Task created successfully");

      navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`);
    } catch (error) {
      alert("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`)
          }
          sx={{
            mb: 1,
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          Back to Project
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Create Task
        </Typography>

        <Typography color="text.secondary">
          Create a task, assign it to a workspace member, and set priority and
          status.
        </Typography>
      </Box>

      <Container maxWidth="md" disableGutters>
        <Paper
          sx={{
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderBottom: "1px solid #e5e7eb",
              bgcolor: "#ffffff",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#e0e7ff",
                color: "#3730a3",
              }}
            >
              <TaskAltIcon />
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Task Information
              </Typography>

              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Enter the basic details for your new task.
              </Typography>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
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
            <TextField
              required
              fullWidth
              label="Task Title"
              autoComplete="off"
              autoFocus
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setTitle(e.target.value)
              }
              sx={{
                gridColumn: {
                  xs: "span 1",
                  md: "span 2",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              required
              fullWidth
              multiline
              rows={5}
              label="Description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setDescription(e.target.value)
              }
              sx={{
                gridColumn: {
                  xs: "span 1",
                  md: "span 2",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              required
              fullWidth
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setDueDate(e.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              required
              fullWidth
              select
              label="Assign To"
              value={assignedToUserId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setAssignedToUserId(e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={String(member.id)}>
                  {member.firstName} {member.lastName} - {member.email}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              select
              label="Task Status"
              value={taskStatus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setTaskStatus(e.target.value as TaskStatus)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="TO_DO">To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </TextField>

            <TextField
              required
              fullWidth
              select
              label="Task Priority"
              value={taskPriority}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setTaskPriority(e.target.value as TaskPriority)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>

            {members.length === 0 && (
              <Typography
                color="text.secondary"
                sx={{
                  gridColumn: {
                    xs: "span 1",
                    md: "span 2",
                  },
                  fontSize: 13,
                }}
              >
                No workspace members found. Add members to the workspace before
                assigning tasks.
              </Typography>
            )}

            <Box
              sx={{
                gridColumn: {
                  xs: "span 1",
                  md: "span 2",
                },
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    `/dashboard/workspaces/${workspaceId}/projects/${projectId}`
                  )
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 3,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 3,
                  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
                }}
              >
                {submitting ? "Creating..." : "Create Task"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}