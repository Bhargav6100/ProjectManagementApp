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

import FolderIcon from "@mui/icons-material/Folder";
import { createProject } from "../../services/projectServices";
import type { ProjectStatus } from "../../utils/ProjectStatus";
import { useProjects } from "../../context/ProjectContext";

export default function ProjectForm(): React.JSX.Element {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<ProjectStatus>("ACTIVE");
 
  const {fetchProjectsByWorkspace} = useProjects();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!workspaceId) {
      alert("Workspace id is missing");
      return;
    }

    await createProject(Number(workspaceId), {
      name,
      description,
      status,
    });
    
    await fetchProjectsByWorkspace(Number(workspaceId));

    alert("Project created successfully");
    

    navigate(`/dashboard/workspaces/${workspaceId}`);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <FolderIcon color="primary" />

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Create Project
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Project Name"
            autoComplete="off"
            autoFocus
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
            <MenuItem value="COMPLETE">Complete</MenuItem>
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
            Create Project
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}