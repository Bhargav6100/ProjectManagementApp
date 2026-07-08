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
import FolderIcon from "@mui/icons-material/Folder";
import { useProjects } from "../../context/ProjectContext";
import { updateProject } from "../../services/projectServices";
import type { ProjectStatus } from "../../utils/ProjectStatus";
export default function EditProject(): React.JSX.Element {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    fetchProjectById,
    fetchProjectsByWorkspace,
    loading,
  } = useProjects();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<ProjectStatus>("ACTIVE");
  const [submitting, setSubmitting] = useState<boolean>(false);
  useEffect(() => {
    if (projectId) {
      fetchProjectById(Number(projectId));
    }
  }, [projectId]);
  useEffect(() => {
    if (currentProject) {
      setName(currentProject.name);
      setDescription(currentProject.description);
      setStatus(currentProject.status);
    }
  }, [currentProject]);
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!workspaceId || !projectId) {
      alert("Workspace id or project id is missing");
      return;
    }
    try {
      setSubmitting(true);
      await updateProject(Number(projectId), { name, description, status });
      await fetchProjectsByWorkspace(Number(workspaceId));
      alert("Project updated successfully");
      navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`);
    } catch (error) {
      alert("Failed to update project");
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
          
          <Typography color="text.secondary">
            Loading project...
          </Typography>
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
              `/dashboard/workspaces/${workspaceId}/projects/${projectId}`,
            )
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
          
          Edit Project
        </Typography>
        <Typography color="text.secondary">
          
          Update project details and change its current status.
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
              
              <FolderIcon />
            </Avatar>
            <Box>
              
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                
                Project Information
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                
                Edit the basic details for this project.
              </Typography>
            </Box>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            
            <TextField
              required
              fullWidth
              label="Project Name"
              autoComplete="off"
              autoFocus
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setName(e.target.value)
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              required
              fullWidth
              select
              label="Status"
              value={status}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setStatus(e.target.value as ProjectStatus)
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="COMPLETE">Completed</MenuItem>
              <MenuItem value="ARCHIVED">Archived</MenuItem>
            </TextField>
            <Box
              sx={{
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
                    `/dashboard/workspaces/${workspaceId}/projects/${projectId}`,
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
                
                {submitting ? "Updating..." : "Update Project"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
