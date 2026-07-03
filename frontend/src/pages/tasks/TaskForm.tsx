import React, { useState } from "react";
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
import { createTask } from "../../services/taskServices";
import { useUsers } from "../../context/UsersContext";
import type { TaskStatus } from "../../utils/TaskStatus";
import type { TaskPriority } from "../../utils/TaskPriority";

export default function TaskForm(): React.JSX.Element {
  const navigate = useNavigate();
  const { workspaceId, projectId } = useParams();

  const { users } = useUsers();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [assignedToUserId, setAssignedToUserId] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("TO_DO");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("MEDIUM");

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

    await createTask(Number(projectId), {
      title,
      description,
      dueDate,
      assignedToUserId: Number(assignedToUserId),
      taskStatus,
      taskPriority,
    });

    alert("Task created successfully");

    navigate(`/dashboard/workspaces/${workspaceId}`);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <TaskAltIcon color="primary" />

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Create Task
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Task Title"
            autoComplete="off"
            autoFocus
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
            {users.map((member) => (
              <MenuItem key={member.id} value={String(member.id)}>
                {member.firstName} {member.lastName} - {member.email}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Task Status"
            value={taskStatus}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setTaskStatus(e.target.value as TaskStatus)
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
            label="Task Priority"
            value={taskPriority}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setTaskPriority(e.target.value as TaskPriority)
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
            Create Task
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={() =>
              navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`)
            }
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}