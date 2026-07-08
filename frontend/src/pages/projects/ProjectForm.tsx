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
import FolderIcon from "@mui/icons-material/Folder";

import { createProject } from "../../services/projectServices";
import type { ProjectStatus } from "../../utils/ProjectStatus";
import { useProjects } from "../../context/ProjectContext";
import { useSnackbar } from "../../context/SnackbarContext";

export default function ProjectForm(): React.JSX.Element {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<ProjectStatus>("ACTIVE");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { fetchProjectsByWorkspace } = useProjects();

  const {showSnackbar} = useSnackbar();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!workspaceId) {
      showSnackbar("Workspace id is missing");
      return;
    }

    try {
      setSubmitting(true);

      await createProject(Number(workspaceId), {
        name,
        description,
        status,
      });

      await fetchProjectsByWorkspace(Number(workspaceId));

      showSnackbar("Project created successfully");

      navigate(`/dashboard/workspaces/${workspaceId}`);
    } catch (error) {
      showSnackbar("Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/dashboard/workspaces/${workspaceId}`)}
          sx={{
            mb: 1,
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          Back to Workspace
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Create Project
        </Typography>

        <Typography color="text.secondary">
          Create a project inside this workspace and set its initial status.
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
              <FolderIcon />
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Project Information
              </Typography>

              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Enter the basic details for your new project.
              </Typography>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
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
              sx={{
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="COMPLETE">Complete</MenuItem>
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
                onClick={() => navigate(`/dashboard/workspaces/${workspaceId}`)}
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
                {submitting ? "Creating..." : "Create Project"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}