import React, { useEffect, useState } from "react";
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
import { useTasks } from "../../context/TaskContext";
import { useWorkspaces } from "../../context/WorkspaceContext";
import { updateTask, updateTaskStatus } from "../../services/taskServices";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";
import type { TaskStatus } from "../../utils/TaskStatus";
import type { TaskPriority } from "../../utils/TaskPriority";
export default function EditTask(): React.JSX.Element {
  const navigate = useNavigate();
  const { workspaceId, projectId, taskId } = useParams();
  const { user } = useAuth();
  const { currentTask, fetchTaskById, fetchTasksByProject, loading } = useTasks();
  const { members, fetchWorkspaceMembers } = useWorkspaces();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [assignedToUserId, setAssignedToUserId] = useState<string>("");
  const [taskStatus, setStatus] = useState<TaskStatus>("TO_DO");
  const [taskPriority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const {showSnackbar} = useSnackbar();

  const isMember = user?.role === "MEMBER";
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
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!taskId || !projectId || !workspaceId) {
      showSnackbar("Task, project, or workspace id is missing");
      return;
    }
    if (!assignedToUserId) {
      showSnackbar("Please assign this task to a member");
      return;
    }
    try {
      setSubmitting(true);
      await updateTask(Number(taskId), {
        title,
        description,
        dueDate,
        assignedToUserId: Number(assignedToUserId),
        taskStatus,
        taskPriority,
      });
      await fetchTasksByProject(Number(projectId));
      showSnackbar("Task updated successfully");
      navigate(
        `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
      );
    } catch (error) {
      showSnackbar("Failed to update task");
    } finally {
      setSubmitting(false);
    }
  };
  const handleTaskStatus = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!taskId || !projectId || !workspaceId) {
      showSnackbar("Task, project, or workspace id is missing");
      return;
    }
    try {
      setSubmitting(true);
      await updateTaskStatus(Number(taskId), { taskStatus });
      await fetchTasksByProject(Number(projectId));
      showSnackbar("Task status updated successfully");
      navigate(
        `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
      );
    } catch (error) {
      showSnackbar("Failed to update task status");
    } finally {
      setSubmitting(false);
    }
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
  return (
    <Box>
      
      <Box sx={{ mb: 3 }}>
        
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate(
              `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
            )
          }
          sx={{
            mb: 1,
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          
          Back to Task
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          
          {isMember ? "Update Task Status" : "Edit Task"}
        </Typography>
        <Typography color="text.secondary">
          
          {isMember
            ? "Update the current progress status for this assigned task."
            : "Update task details, assignment, due date, status, and priority."}
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
            
            <Avatar sx={{ bgcolor: "#e0e7ff", color: "#3730a3" }}>
              
              <TaskAltIcon />
            </Avatar>
            <Box>
              
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                
                Task Information
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                
                {isMember
                  ? "Only task status can be updated by members."
                  : "Edit the basic details for this task."}
              </Typography>
            </Box>
          </Box>
          <Box
            component="form"
            onSubmit={isMember ? handleTaskStatus : handleSubmit}
            sx={{
              p: 3,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 2.5,
            }}
          >
            
            <TextField
              required
              fullWidth
              disabled={isMember}
              label="Task Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setTitle(e.target.value)
              }
              sx={{
                gridColumn: { xs: "span 1", md: "span 2" },
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
            <TextField
              required
              fullWidth
              disabled={isMember}
              multiline
              rows={5}
              label="Description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setDescription(e.target.value)
              }
              sx={{
                gridColumn: { xs: "span 1", md: "span 2" },
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
            <TextField
              required
              fullWidth
              disabled={isMember}
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setDueDate(e.target.value)
              }
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              required
              fullWidth
              disabled={isMember}
              select
              label="Assign To"
              value={assignedToUserId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setAssignedToUserId(e.target.value)
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
              label="Status"
              value={taskStatus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setStatus(e.target.value as TaskStatus)
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              
              <MenuItem value="TO_DO">To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </TextField>
            <TextField
              required
              fullWidth
              disabled={isMember}
              select
              label="Priority"
              value={taskPriority}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPriority(e.target.value as TaskPriority)
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>
            {members.length === 0 && !isMember && (
              <Typography
                color="text.secondary"
                sx={{
                  gridColumn: { xs: "span 1", md: "span 2" },
                  fontSize: 13,
                }}
              >
                
                No workspace members found. Add members to the workspace before
                assigning tasks.
              </Typography>
            )}
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 2" },
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
                    `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
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
                
                {submitting
                  ? isMember
                    ? "Updating Status..."
                    : "Updating..."
                  : isMember
                    ? "Update Status"
                    : "Update Task"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
