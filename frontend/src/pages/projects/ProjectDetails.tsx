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
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EditIcon from "@mui/icons-material/Edit";

import { useProjects } from "../../context/ProjectContext";
import type { ProjectStatus } from "../../utils/ProjectStatus";

export default function ProjectDetails(): React.JSX.Element {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();

  const { currentProject, fetchProjectById, loading } = useProjects();

  useEffect(() => {
    if (projectId) {
      fetchProjectById(Number(projectId));
    }
  }, [projectId]);

  const formatStatus = (status: ProjectStatus): string => {
    if (status === "ACTIVE") {
      return "active";
    }

    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const getStatusColor = (
    status: ProjectStatus
  ): "success" | "warning" | "default" => {
    if (status === "COMPLETE") {
      return "success";
    }

    if (status === "ACTIVE") {
      return "warning";
    }

    return "default";
  };

  if (loading) {
    return (
      <Box>
        <Typography>Loading project...</Typography>
      </Box>
    );
  }

  if (!currentProject) {
    return (
      <Box>
        <Typography color="error">Project not found.</Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2, textTransform: "none" }}
          onClick={() =>
            navigate(`/dashboard/workspaces/${workspaceId}/projects`)
          }
        >
          Back to Projects
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
            onClick={() =>
              navigate(`/dashboard/workspaces/${workspaceId}/projects`)
            }
          >
            Back to Projects
          </Button>

          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Project Details
          </Typography>

          <Typography color="text.secondary">
            View project information, status, and related tasks.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
            onClick={() =>
              navigate(
                `/dashboard/workspaces/${workspaceId}/projects/${currentProject.id}/edit`
              )
            }
          >
            Edit Project
          </Button>

          <Button
            variant="contained"
            startIcon={<TaskAltIcon />}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
            onClick={() =>
              navigate(
                `/dashboard/workspaces/${workspaceId}/projects/${currentProject.id}/tasks/create`
              )
            }
          >
            Create Task
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64 }}>
            <FolderIcon fontSize="large" />
          </Avatar>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {currentProject.name}
            </Typography>

            <Chip
              label={formatStatus(currentProject.status)}
              color={getStatusColor(currentProject.status)}
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
            {currentProject.description || "No description provided."}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
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
                  {currentProject.createdBy}
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
                  {new Date(currentProject.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FolderIcon color="primary" />

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Workspace ID
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  {currentProject.workspaceId}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Project Tasks
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Tasks connected to this project will be displayed here.
        </Typography>

        <Button
          variant="outlined"
          startIcon={<TaskAltIcon />}
          sx={{ textTransform: "none", borderRadius: 2 }}
          onClick={() =>
            navigate(
              `/dashboard/workspaces/${workspaceId}/projects/${currentProject.id}/tasks`
            )
          }
        >
          Open Tasks
        </Button>
      </Paper>
    </Box>
  );
}