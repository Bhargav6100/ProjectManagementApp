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

import FolderIcon from "@mui/icons-material/Folder";
import { useProjects } from "../../context/ProjectContext";
import { updateProject } from "../../services/projectServices";
import type { ProjectStatus } from "../../utils/ProjectStatus";

export default function EditProject(): React.JSX.Element {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();

  const { currentProject, fetchProjectById, fetchProjectsByWorkspace, loading } =
    useProjects();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<ProjectStatus>("ACTIVE");

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
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!workspaceId || !projectId) {
      alert("Workspace id or project id is missing");
      return;
    }

    await updateProject(Number(projectId), {
      name,
      description,
      status,
    });

    await fetchProjectsByWorkspace(Number(workspaceId));

    alert("Project updated successfully");

    navigate(`/dashboard/workspaces/${workspaceId}`);
  };

  if (loading) {
    return <Typography>Loading project...</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <FolderIcon color="primary" />

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Edit Project
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Project Name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setName(e.target.value)
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
            select
            label="Status"
            value={status}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setStatus(e.target.value as ProjectStatus)
            }
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="COMPLETE">Completed</MenuItem>
            <MenuItem value="ARCHIVED">Archived</MenuItem>
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
            Update Project
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