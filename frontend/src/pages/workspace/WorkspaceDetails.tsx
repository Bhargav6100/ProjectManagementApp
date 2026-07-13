import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import GroupsIcon from "@mui/icons-material/Groups";
import EmailIcon from "@mui/icons-material/Email";
import AddIcon from "@mui/icons-material/Add";

import { useWorkspaces } from "../../context/WorkspaceContext";
import { useProjects } from "../../context/ProjectContext";
import { useUsers } from "../../context/UsersContext";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";

export default function WorkspaceDetails(): React.JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentWorkspace,
    fetchWorkspaceById,
    addMemberToWorkspace,
    loading,
    fetchWorkspaceMembers,
    members,
    deleteWorkspaceMember,
  } = useWorkspaces();

  const { projects, fetchProjectsByWorkspace } = useProjects();
  const { users } = useUsers();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const existingMemberIds = new Set(members.map((member) => member.id));

  const availableUsers = users.filter((member) => {
    const isAlreadyMember = existingMemberIds.has(member.id);
    const isAdminUser = member.role === "ADMIN";

    return !isAlreadyMember && !isAdminUser;
  });

  const isAdmin = user?.role === "ADMIN";
  const isPM = user?.role === "PROJECT_MANAGER";

  useEffect(() => {
    if (id) {
      fetchWorkspaceById(Number(id));
      fetchProjectsByWorkspace(Number(id));
      fetchWorkspaceMembers(Number(id));
    }
  }, [id]);

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleAddMember = async (): Promise<void> => {
    if (!currentWorkspace) {
      return;
    }

    if (!selectedUserId) {
      showSnackbar("Please select a member");
      return;
    }

    await addMemberToWorkspace(currentWorkspace.id, Number(selectedUserId));

    await fetchWorkspaceMembers(currentWorkspace.id);

    showSnackbar("Member added to workspace successfully");
    setSelectedUserId("");
  };

  const handleDeleteMember = async (
    userId: number,
    memberName: string,
  ): Promise<void> => {
    if (!currentWorkspace) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${memberName} from this workspace?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteWorkspaceMember(currentWorkspace.id, userId);

    await fetchWorkspaceMembers(currentWorkspace.id);

    showSnackbar("Member removed from workspace successfully");
  };

  const formatRole = (role: string): string => {
    if (role === "PROJECT_MANAGER") {
      return "Project Manager";
    }

    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const formatProjectStatus = (status: string): string => {
    if (status === "ACTIVE") {
      return "Active";
    }

    if (status === "COMPLETE") {
      return "Completed";
    }

    if (status === "ARCHIVED") {
      return "Archived";
    }

    return status;
  };

  const getProjectStatusColor = (
    status: string,
  ): "warning" | "success" | "default" => {
    if (status === "COMPLETE") {
      return "success";
    }

    if (status === "ACTIVE") {
      return "warning";
    }

    return "default";
  };

  const formatDate = (date?: string): string => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
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
            Loading workspace details...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!currentWorkspace) {
    return (
      <Box>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mx: "auto",
              mb: 2,
              bgcolor: "#f1f5f9",
              color: "#64748b",
            }}
          >
            <WorkspacesIcon />
          </Avatar>

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Workspace not found
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            The selected workspace could not be loaded.
          </Typography>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/workspaces")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Back to Workspaces
          </Button>
        </Paper>
      </Box>
    );
  }

  const statCards = [
    {
      label: "Projects",
      value: projects.length,
      helper: "Connected projects",
      icon: <FolderIcon />,
    },
    {
      label: "Members",
      value: members.length,
      helper: "Workspace members",
      icon: <GroupsIcon />,
    },
    {
      label: "Created By",
      value: currentWorkspace.createdBy,
      helper: "Workspace owner",
      icon: <PersonIcon />,
    },
    {
      label: "Created At",
      value: formatDate(currentWorkspace.createdAt),
      helper: "Creation date",
      icon: <CalendarMonthIcon />,
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 1,
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
            }}
            onClick={() => navigate("/dashboard/workspaces")}
          >
            Back to Workspaces
          </Button>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Workspace Details
          </Typography>

          <Typography color="text.secondary">
            View workspace information, members, and related project activity.
          </Typography>
        </Box>

        {(isAdmin || isPM) && (
          <Button
            variant="contained"
            startIcon={<FolderIcon />}
            onClick={() =>
              navigate(
                `/dashboard/workspaces/${currentWorkspace.id}/projects/create`,
              )
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1,
              fontWeight: 700,
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
            }}
          >
            Create Project
          </Button>
        )}
      </Box>

      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          mb: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 76,
                height: 76,
                bgcolor: "#e0e7ff",
                color: "#3730a3",
              }}
            >
              <WorkspacesIcon fontSize="large" />
            </Avatar>

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {currentWorkspace.name}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {currentWorkspace.description || "No description provided."}
              </Typography>

              <Chip
                label="Active Workspace"
                color="success"
                sx={{
                  mt: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: "#f8fafc",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Workspace ID
            </Typography>

            <Typography sx={{ fontWeight: 800 }}>
              #{currentWorkspace.id}
            </Typography>
          </Box>
        </Box>
      </Paper>

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
        {statCards.map((card) => (
          <Paper
            key={card.label}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
              transition: "0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 16px 35px rgba(15, 23, 42, 0.1)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "#eef2ff",
                  color: "#3730a3",
                }}
              >
                {card.icon}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 13, fontWeight: 600 }}
                >
                  {card.label}
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    mt: 0.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {card.value}
                </Typography>

                <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                  {card.helper}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          mb: 3,
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Workspace Information
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Basic workspace details and ownership information
            </Typography>
          </Box>

          <Chip
            label="Overview"
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: "#eef2ff",
              color: "#3730a3",
            }}
          />
        </Box>

        <Box
          sx={{
            p: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2.5,
          }}
        >
          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Workspace Name
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {currentWorkspace.name}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Created By
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {currentWorkspace.createdBy}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Created At
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {formatDate(currentWorkspace.createdAt)}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Description
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {currentWorkspace.description || "No description provided."}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          mb: 3,
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Workspace Projects
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Projects connected to this workspace.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`${projects.length} Projects`}
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: "#eef2ff",
                color: "#3730a3",
              }}
            />

            {(isAdmin || isPM) && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                }}
                onClick={() =>
                  navigate(
                    `/dashboard/workspaces/${currentWorkspace.id}/projects/create`,
                  )
                }
              >
                Add Project
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {projects.length === 0 ? (
            <Box
              sx={{
                border: "1px dashed #d1d5db",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                bgcolor: "#f9fafb",
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 1.5,
                  bgcolor: "#f1f5f9",
                  color: "#64748b",
                }}
              >
                <FolderIcon />
              </Avatar>

              <Typography sx={{ fontWeight: 800 }}>
                No projects found
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Create your first project inside this workspace.
              </Typography>

              {(isAdmin || isPM) && (
                <Button
                  variant="contained"
                  startIcon={<FolderIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 700,
                  }}
                  onClick={() =>
                    navigate(
                      `/dashboard/workspaces/${currentWorkspace.id}/projects/create`,
                    )
                  }
                >
                  Create Project
                </Button>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {projects.map((project) => (
                <Paper
                  key={project.id}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    cursor: "pointer",
                    borderColor: "#e5e7eb",
                    transition: "0.2s ease",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                      borderColor: "#c7d2fe",
                      transform: "translateY(-3px)",
                      boxShadow: "0 16px 35px rgba(15, 23, 42, 0.1)",
                    },
                  }}
                  onClick={() =>
                    navigate(
                      `/dashboard/workspaces/${currentWorkspace.id}/projects/${project.id}`,
                    )
                  }
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: "#e0e7ff",
                        color: "#3730a3",
                      }}
                    >
                      <FolderIcon />
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project.name}
                      </Typography>

                      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                        Created by {project.createdBy}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      minHeight: 42,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {project.description || "No description provided."}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      size="small"
                      label={formatProjectStatus(project.status)}
                      color={getProjectStatusColor(project.status)}
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <TaskAltIcon fontSize="small" color="disabled" />

                      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                        Tasks
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Paper>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Workspace Members
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Members available to work on projects in this workspace.
            </Typography>
          </Box>

          <Chip
            icon={<GroupsIcon />}
            label={`${members.length} Members`}
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: "#eef2ff",
              color: "#3730a3",
            }}
          />
        </Box>

        {(isAdmin || isPM) && (
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid #e5e7eb",
              bgcolor: "#f9fafb",
            }}
          >
            <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
              Add Member
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13, mb: 2 }}>
              Add users to this workspace so they can work on projects and
              tasks.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <TextField
                select
                label="Select Member"
                value={selectedUserId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setSelectedUserId(e.target.value)
                }
                sx={{
                  minWidth: { xs: "100%", sm: 420 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                  },
                }}
                slotProps={{
                  select: {
                    displayEmpty: true,
                    renderValue: (selected: unknown): React.ReactNode => {
                      const selectedUser = availableUsers.find(
                        (member) => member.id === Number(selected),
                      );

                      if (!selectedUser) {
                        return "Select Member";
                      }

                      return `${selectedUser.firstName} ${selectedUser.lastName}`;
                    },
                    MenuProps: {
                      slotProps: {
                        paper: {
                          sx: {
                            mt: 1,
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.16)",
                            maxHeight: 320,
                          },
                        },
                        list: {
                          sx: {
                            p: 1,
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {availableUsers.length > 0 ? availableUsers.map((member) => (
                  <MenuItem
                    key={member.id}
                    value={String(member.id)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      py: 1.2,
                      "&:hover": {
                        bgcolor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        bgcolor: "#eef2ff",
                        "&:hover": {
                          bgcolor: "#e0e7ff",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        width: "100%",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: 14,
                          fontWeight: 800,
                          bgcolor: "#e0e7ff",
                          color: "#3730a3",
                        }}
                      >
                        {member.firstName.charAt(0)}
                        {member.lastName.charAt(0)}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                          {member.firstName} {member.lastName}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: 12,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {member.email}
                        </Typography>
                      </Box>

                      <Chip
                        label={
                          member.role === "PROJECT_MANAGER"
                            ? "Project Manager"
                            : member.role.charAt(0) +
                              member.role.slice(1).toLowerCase()
                        }
                        size="small"
                        color={
                          member.role === "PROJECT_MANAGER"
                            ? "success"
                            : "default"
                        }
                        sx={{
                          fontWeight: 700,
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                  </MenuItem>
                )):<MenuItem>All the available users are already members or no members found</MenuItem>}
              </TextField>

              <Button
                variant="contained"
                disabled={!selectedUserId}
                onClick={() => {
                  void handleAddMember();
                }}
                sx={{
                  height: 56,
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  fontWeight: 700,
                  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
                }}
              >
                Add Member
              </Button>
            </Box>

            {users.length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No users available. Create users first before adding members to
                a workspace.
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ p: 3 }}>
          {members.length === 0 ? (
            <Box
              sx={{
                border: "1px dashed #d1d5db",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                bgcolor: "#f9fafb",
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 1.5,
                  bgcolor: "#f1f5f9",
                  color: "#64748b",
                }}
              >
                <GroupsIcon />
              </Avatar>

              <Typography sx={{ fontWeight: 800 }}>No members found</Typography>

              <Typography color="text.secondary">
                Add users first so they can be assigned to projects and tasks.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {members.map((member) => (
                <Paper
                  key={member.id}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    borderColor: "#e5e7eb",
                    transition: "0.2s ease",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                      borderColor: "#c7d2fe",
                      transform: "translateY(-3px)",
                      boxShadow: "0 16px 35px rgba(15, 23, 42, 0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          fontWeight: 800,
                          bgcolor: "#e0e7ff",
                          color: "#3730a3",
                        }}
                      >
                        {getInitials(member.firstName, member.lastName)}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800 }}>
                          {member.firstName} {member.lastName}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <EmailIcon sx={{ fontSize: 15 }} color="disabled" />

                          <Typography
                            color="text.secondary"
                            sx={{
                              fontSize: 13,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 180,
                            }}
                          >
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {(isAdmin || isPM) && (
                      <Tooltip title="Remove member">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            void handleDeleteMember(
                              member.id,
                              `${member.firstName} ${member.lastName}`,
                            );
                          }}
                          sx={{
                            bgcolor: "#fef2f2",
                            "&:hover": {
                              bgcolor: "#fee2e2",
                            },
                          }}
                        >
                          <PersonRemoveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={formatRole(member.role)}
                      size="small"
                      color={
                        member.role === "ADMIN"
                          ? "primary"
                          : member.role === "PROJECT_MANAGER"
                            ? "success"
                            : "default"
                      }
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
