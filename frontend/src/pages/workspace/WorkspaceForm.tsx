import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { createWorkspace } from "../../services/workspaceServices";
import { useWorkspaces } from "../../context/WorkspaceContext";

export default function WorkspaceForm(): React.JSX.Element {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const {fetchWorkspaces} = useWorkspaces();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    await createWorkspace({
      name,
      description,
    });
   
    await fetchWorkspaces();
    alert("Workspace created successfully");
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <WorkspacesIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Create Workspace
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Workspace Name"
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: 2, textTransform: "none" }}
          >
            Create Workspace
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={() => navigate("/workspaces")}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}