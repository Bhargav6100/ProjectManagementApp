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

import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWorkspaces } from "../../context/WorkspaceContext";
import { useProjects } from "../../context/ProjectContext";

export default function AdminWorkspaces(): React.JSX.Element {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    workspaces,
    fetchWorkspaces,
    fetchMyWorkspaces,
    loading,
    deleteWorkspace,
    membersByWorkspaceId,
    fetchWorkspaceMembers,
  } = useWorkspaces();

  const { allProjects, fetchAllProjects, fetchMyProjects } = useProjects();

  const [search, setSearch] = useState<string>("");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      fetchWorkspaces();
      fetchAllProjects();
    } else {
      fetchMyWorkspaces();
      fetchMyProjects();
    }
  }, []);

  useEffect(() => {
    if (workspaces.length === 0) return;

    workspaces.forEach((workspace) => {
      if (!membersByWorkspaceId[workspace.id]) {
        fetchWorkspaceMembers(workspace.id);
      }
    });
  }, [workspaces, membersByWorkspaceId, fetchWorkspaceMembers]);

  const query = search.toLowerCase();

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((workspace) => {
      const name = workspace.name.toLowerCase();
      const description = workspace.description?.toLowerCase() ?? "";
      const createdBy = workspace.createdBy?.toLowerCase() ?? "";

      return (
        name.includes(query) ||
        description.includes(query) ||
        createdBy.includes(query)
      );
    });
  }, [workspaces, query]);

  const totalMembers = useMemo(() => {
    return Object.values(membersByWorkspaceId).reduce(
      (sum, members) => sum + members.length,
      0
    );
  }, [membersByWorkspaceId]);

  const emptyWorkspaces = useMemo(() => {
    return workspaces.filter((workspace) => {
      const workspaceProjects = allProjects.filter(
        (project) => project.workspaceId === workspace.id
      );

      return workspaceProjects.length === 0;
    }).length;
  }, [workspaces, allProjects]);

  const getInitials = (name: string): string => {
    return (
      name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase() || "W"
    );
  };

  const getWorkspaceProjectsCount = (workspaceId: number): number => {
    return allProjects.filter((project) => project.workspaceId === workspaceId)
      .length;
  };

  const summaryCardSx = {
    p: 2.5,
    borderRadius: 3,
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
    transition: "all 0.2s ease",

    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 16px 36px rgba(15, 23, 42, 0.07)",
      borderColor: "rgba(25, 118, 210, 0.25)",
    },
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Workspaces
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: 15 }}>
            {isAdmin
              ? "View and manage all project workspaces."
              : "View your assigned workspaces and related projects."}
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddBusinessIcon />}
            onClick={() => navigate("/dashboard/workspaces/create")}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              px: 3,
              py: 1,
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            Create Workspace
          </Button>
        )}
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
        <Paper sx={summaryCardSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 42,
                height: 42,
              }}
            >
              <WorkspacesIcon fontSize="small" />
            </Avatar>

            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Total Workspaces
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {workspaces.length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={summaryCardSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "success.main",
                width: 42,
                height: 42,
              }}
            >
              <FolderIcon fontSize="small" />
            </Avatar>

            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Total Projects
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {allProjects.length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={summaryCardSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                width: 42,
                height: 42,
              }}
            >
              <GroupsIcon fontSize="small" />
            </Avatar>

            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Total Members
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {totalMembers}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={summaryCardSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "#64748b",
                width: 42,
                height: 42,
              }}
            >
              <BusinessIcon fontSize="small" />
            </Avatar>

            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Empty Workspaces
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {emptyWorkspaces}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          p: 2.5,
          mb: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Search workspaces by name, description, or creator..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setSearch(e.target.value)
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: "#f9fafb",
              },
            },
          }}
        />
      </Paper>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          mb: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.3 }}>
              Workspace Directory
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {isAdmin
                ? "All workspaces created inside the system."
                : "Workspaces assigned to you."}
            </Typography>
          </Box>

          <Chip
            label={`${filteredWorkspaces.length} workspaces`}
            color="primary"
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  Workspace
                </TableCell>

                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  Created By
                </TableCell>

                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  Members
                </TableCell>

                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  Projects
                </TableCell>

                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  Status
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ fontWeight: 800, color: "text.secondary" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Loading workspaces...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredWorkspaces.map((workspace) => {
                  const workspaceMembers =
                    membersByWorkspaceId[workspace.id] ?? [];

                  const workspaceProjectsCount = getWorkspaceProjectsCount(
                    workspace.id
                  );

                  const isWorkspaceActive = workspaceProjectsCount > 0;

                  return (
                    <TableRow
                      key={workspace.id}
                      hover
                      onClick={() =>
                        navigate(`/dashboard/workspaces/${workspace.id}`)
                      }
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",

                        "&:hover": {
                          bgcolor: "#f9fafb",
                        },

                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              bgcolor: "primary.main",
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {getInitials(workspace.name)}
                          </Avatar>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700 }}>
                              {workspace.name}
                            </Typography>

                            <Typography
                              color="text.secondary"
                              sx={{
                                fontSize: 13,
                                maxWidth: 420,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {workspace.description ||
                                "No description provided"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontSize: 14 }}>
                          {workspace.createdBy || "N/A"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`${workspaceMembers.length} members`}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`${workspaceProjectsCount} projects`}
                          size="small"
                          variant="outlined"
                          color={workspaceProjectsCount > 0 ? "success" : "default"}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={isWorkspaceActive ? "Active" : "Empty"}
                          size="small"
                          color={isWorkspaceActive ? "success" : "default"}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        {isAdmin ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 0.5,
                            }}
                          >
                            <Tooltip title="Edit workspace">
                              <IconButton
                                size="small"
                                onClick={(e): void => {
                                  e.stopPropagation();
                                  navigate(
                                    `/dashboard/workspaces/${workspace.id}/edit`
                                  );
                                }}
                                sx={{
                                  bgcolor: "#f9fafb",

                                  "&:hover": {
                                    bgcolor: "rgba(25, 118, 210, 0.08)",
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete workspace">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e): void => {
                                  e.stopPropagation();
                                  deleteWorkspace(workspace.id);
                                }}
                                sx={{
                                  bgcolor: "#fff5f5",

                                  "&:hover": {
                                    bgcolor: "rgba(211, 47, 47, 0.08)",
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                            View only
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!loading && filteredWorkspaces.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No workspaces found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}