import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FolderIcon from "@mui/icons-material/Folder";

import { useWorkspaces} from "../../context/WorkspaceContext";

export default function WorkspaceDetails(): React.JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentWorkspace, fetchWorkspaceById, loading } = useWorkspaces();

  useEffect(() => {
    if (id) {
      fetchWorkspaceById(Number(id));
    }
  }, [id]);

  if (loading) {
    return (
      <Box>
        <Typography>Loading workspace...</Typography>
      </Box>
    );
  }

  if (!currentWorkspace) {
    return (
      <Box>
        <Typography color="error">Workspace not found.</Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2, textTransform: "none" }}
          onClick={() => navigate("/workspaces")}
        >
          Back to Workspaces
        </Button>
      </Box>
    );
  }
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 1, textTransform: "none" }}
            onClick={() => navigate("/workspaces")}
          >
            Back to Workspaces
          </Button>

          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Workspace Details
          </Typography>

          <Typography color="text.secondary">
            View workspace information and related project activity.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<FolderIcon />}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          onClick={() =>
            navigate(`/dashboard/workspaces/${currentWorkspace.id}/projects`)
          }
        >
          View Projects
        </Button>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64 }}>
            <WorkspacesIcon fontSize="large" />
          </Avatar>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {currentWorkspace.name}
            </Typography>

            <Chip
              label="Active Workspace"
              color="success"
              size="small"
              sx={{ mt: 1, fontWeight: 600 }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>
            Description
          </Typography>

          <Typography color="text.secondary">
            {currentWorkspace.description || "No description provided."}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        >
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PersonIcon color="primary" />

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Created By
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  {currentWorkspace.createdBy}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarMonthIcon color="primary" />

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Created At
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  {new Date(currentWorkspace.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Workspace Projects
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Projects connected to this workspace will be displayed here.
        </Typography>

        <Button
          variant="outlined"
          startIcon={<FolderIcon />}
          sx={{ textTransform: "none", borderRadius: 2 }}
          onClick={() =>
            navigate(`/dashboard/workspaces/${currentWorkspace.id}/projects/create`)
          }
        >
          Create Projects
        </Button>
      </Paper>
    </Box>
  );
}