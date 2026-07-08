import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

import { useWorkspaces } from "../../context/WorkspaceContext";
import { updateWorkspace } from "../../services/workspaceServices";
import { useSnackbar } from "../../context/SnackbarContext";


export default function EditWorkspace(): React.JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentWorkspace, fetchWorkspaceById, fetchWorkspaces, loading } =
    useWorkspaces();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const {showSnackbar} = useSnackbar();

  useEffect(() => {
    if (id) {
      fetchWorkspaceById(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (currentWorkspace) {
      setName(currentWorkspace.name);
      setDescription(currentWorkspace.description);
    }
  }, [currentWorkspace]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!id) {
      return;
    }

    try {
      setSubmitting(true);

      await updateWorkspace(Number(id), {
        name,
        description,
      });

      await fetchWorkspaces();

      showSnackbar("Workspace updated successfully");

      navigate(`/dashboard/workspaces/${id}`);
    } catch (error) {
      showSnackbar("Failed to update workspace");
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
            Loading workspace...
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
          onClick={() => navigate(`/dashboard/workspaces/${id}`)}
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
          Edit Workspace
        </Typography>

        <Typography color="text.secondary">
          Update workspace details used to organize projects, members, and tasks.
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
              <WorkspacesIcon />
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Workspace Information
              </Typography>

              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Edit the basic details for this workspace.
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
              label="Workspace Name"
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
                onClick={() => navigate(`/dashboard/workspaces/${id}`)}
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
                {submitting ? "Updating..." : "Update Workspace"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}