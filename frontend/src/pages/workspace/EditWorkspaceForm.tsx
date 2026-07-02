import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { useWorkspaces } from "../../context/WorkspaceContext";
import { updateWorkspace } from "../../services/workspaceServices";

export default function EditWorkspace(): React.JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentWorkspace, fetchWorkspaceById, fetchWorkspaces, loading } =
    useWorkspaces();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

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

    await updateWorkspace(Number(id), {
      name,
      description,
    });

    await fetchWorkspaces();

    alert("Workspace updated successfully");

    navigate(`/dashboard/workspaces/${id}`);
  };

  if (loading) {
    return <Typography>Loading workspace...</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <WorkspacesIcon color="primary" />

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Edit Workspace
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Workspace Name"
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
            Update Workspace
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={() => navigate(`/dashboard/workspaces/${id}`)}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}