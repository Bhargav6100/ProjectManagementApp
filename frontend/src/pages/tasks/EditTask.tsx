import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { useTasks } from "../../context/TaskContext";
import { useWorkspaces } from "../../context/WorkspaceContext";
import { updateTask } from "../../services/taskServices";

import type { TaskStatus } from "../../utils/TaskStatus";
import type { TaskPriority } from "../../utils/TaskPriority";

export default function EditTask(): React.JSX.Element {
  const navigate = useNavigate();
  const { workspaceId, projectId, taskId } = useParams();

  const { currentTask, fetchTaskById, fetchTasksByProject, loading } =
    useTasks();

  const { members, fetchWorkspaceMembers } = useWorkspaces();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [assignedToUserId, setAssignedToUserId] = useState<string>("");
  const [taskStatus, setStatus] = useState<TaskStatus>("TO_DO");
  const [taskPriority, setPriority] = useState<TaskPriority>("MEDIUM");

  useEffect(() => {
    if (taskId) {
      fetchTaskById(Number(taskId));
    }

    if (workspaceId) {
      fetchWorkspaceMembers(Number(workspaceId));
    }
  }, [taskId, workspaceId]);

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setDueDate(currentTask.dueDate.substring(0, 10));
      setAssignedToUserId(String(currentTask.assignedToUserId));
      setStatus(currentTask.taskStatus);
      setPriority(currentTask.taskPriority);
    }
  }, [currentTask]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!taskId || !projectId || !workspaceId) {
      alert("Task, project, or workspace id is missing");
      return;
    }

    if (!assignedToUserId) {
      alert("Please assign this task to a member");
      return;
    }

    await updateTask(Number(taskId), {
      title,
      description,
      dueDate,
      assignedToUserId: Number(assignedToUserId),
      taskStatus,
      taskPriority,
    });

    await fetchTasksByProject(Number(projectId));

    alert("Task updated successfully");

    navigate(
      `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  if (loading) {
    return <Typography>Loading task...</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <TaskAltIcon color="primary" />

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Edit Task
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Task Title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setTitle(e.target.value)
            }
          />

          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setDescription(e.target.value)
            }
          />

          <TextField
            margin="normal"
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
          />

          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Assign To"
            value={assignedToUserId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setAssignedToUserId(e.target.value)
            }
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={String(member.id)}>
                {member.firstName}{member.lastName} - {member.email}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Status"
            value={taskStatus}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setStatus(e.target.value as TaskStatus)
            }
          >
            <MenuItem value="TO_DO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </TextField>

          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Priority"
            value={taskPriority}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setPriority(e.target.value as TaskPriority)
            }
          >
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Update Task
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={() =>
              navigate(
                `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
              )
            }
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}