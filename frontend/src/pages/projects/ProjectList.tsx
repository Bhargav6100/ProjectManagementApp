import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import SelectWorkspaceDialog from "../../components/common/SelectWorkspaceDialog";
import type { ProjectStatus } from "../../utils/ProjectStatus";
import { useAuth } from "../../context/AuthContext";

export default function ProjectList(): React.JSX.Element {
  const navigate = useNavigate();

  const { allProjects, fetchAllProjects,fetchMyProjects, loading } = useProjects();
  const {user} = useAuth();
  const [search, setSearch] = useState<string>("");
  const [workspaceDialogOpen, setWorkspaceDialogOpen] =
    useState<boolean>(false);

   useEffect(() => {
    if (!user) return;

    if (user.role === "ADMIN") {
      fetchAllProjects();
    } else {
      console.log("mounted")
      fetchMyProjects();
    }
  }, [user]);

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase();
   
    return allProjects.filter((project) => {
      const name = project.name.toLowerCase();
      const description = project.description?.toLowerCase() ?? "";
      const status = project.status.toLowerCase();
      const createdBy = project.createdBy?.toLowerCase() ?? "";

      return (
        name.includes(query) ||
        description.includes(query) ||
        status.includes(query) ||
        createdBy.includes(query)
      );
    });
  }, [allProjects, search]);

  const activeProjects = allProjects.filter(
    (project) => project.status === "ACTIVE"
  ).length;

  const completeProjects = allProjects.filter(
    (project) => project.status === "COMPLETE"
  ).length;

  const archivedProjects = allProjects.filter(
    (project) => project.status === "ARCHIVED"
  ).length;

  const formatStatus = (status: ProjectStatus): string => {
    if (status === "ACTIVE") {
      return "Active";
    }

    if (status === "COMPLETE") {
      return "Complete";
    }

    return "Archived";
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

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

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
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Projects
          </Typography>

          <Typography color="text.secondary">
            View all projects across all workspaces.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setWorkspaceDialogOpen(true)}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Create Project
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Total Projects</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {allProjects.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Active</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {activeProjects}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Complete</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {completeProjects}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Archived</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {archivedProjects}
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Project Directory
          </Typography>

          <TextField
            size="small"
            placeholder="Search projects..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSearch(e.target.value)
            }
            sx={{ width: 320 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Workspace ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created By</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary">
                      Loading projects...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                    onClick={() =>
                      navigate(
                        `/dashboard/workspaces/${project.workspaceId}/projects/${project.id}`
                      )
                    }
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {getInitials(project.name)}
                        </Avatar>

                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {project.name}
                          </Typography>

                          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                            {project.description || "No description provided"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>{project.workspaceId}</TableCell>

                    <TableCell>
                      <Chip
                        label={formatStatus(project.status)}
                        color={getStatusColor(project.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell>{project.createdBy}</TableCell>

                    <TableCell>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="View project">
                        <IconButton
                          size="small"
                          onClick={(e): void => {
                            e.stopPropagation();
                            navigate(
                              `/dashboard/workspaces/${project.workspaceId}/projects/${project.id}`
                            );
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit project">
                        <IconButton
                          size="small"
                          onClick={(e): void => {
                            e.stopPropagation();
                            navigate(
                              `/dashboard/workspaces/${project.workspaceId}/projects/${project.id}/edit`
                            );
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary">
                      No projects found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SelectWorkspaceDialog
        open={workspaceDialogOpen}
        title="Create Project"
        description="Choose the workspace where this project should be created."
        continueLabel="Continue"
        onClose={() => setWorkspaceDialogOpen(false)}
        onContinue={(workspaceId: number): void => {
          navigate(`/dashboard/workspaces/${workspaceId}/projects/create`);
        }}
      />
    </Box>
  );
}