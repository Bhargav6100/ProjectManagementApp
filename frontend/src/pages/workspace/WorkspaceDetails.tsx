import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useWorkspaces} from "../../context/WorkspaceContext";
import { useProjects } from "../../context/ProjectContext";
import GroupsIcon from "@mui/icons-material/Groups";
import EmailIcon from "@mui/icons-material/Email";
import { useUsers } from "../../context/UsersContext";

export default function WorkspaceDetails(): React.JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentWorkspace, fetchWorkspaceById,addMemberToWorkspace,loading } = useWorkspaces();
  const { projects, fetchProjectsByWorkspace } = useProjects();
  const { users } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const handleAddMember = async (): Promise<void> => {
  if (!currentWorkspace) {
    return;
  }

  if (!selectedUserId) {
    alert("Please select a member");
    return;
  }

  await addMemberToWorkspace(
    currentWorkspace.id,
    Number(selectedUserId)
  );

  alert("Member added to workspace successfully");
  setSelectedUserId("");
};

const formatRole = (role: string): string => {
  if (role === "PROJECT_MANAGER") {
    return "Project Manager";
  }

  return role.charAt(0) + role.slice(1).toLowerCase();
};

  useEffect(() => {
    if (id) {
      fetchWorkspaceById(Number(id));
      fetchProjectsByWorkspace(Number(id));
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
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
    }}
  >
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Workspace Projects
      </Typography>

      <Typography color="text.secondary">
        Projects connected to this workspace.
      </Typography>
    </Box>

    <Button
      variant="outlined"
      startIcon={<FolderIcon />}
      sx={{ textTransform: "none", borderRadius: 2 }}
      onClick={() =>
        navigate(`/dashboard/workspaces/${currentWorkspace.id}/projects/create`)
      }
    >
      Create Project
    </Button>
  </Box>

  {projects.length === 0 ? (
    <Box
      sx={{
        border: "1px dashed #d1d5db",
        borderRadius: 3,
        p: 4,
        textAlign: "center",
      }}
    >
      <FolderIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />

      <Typography sx={{ fontWeight: 600 }}>
        No projects found
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Create your first project inside this workspace.
      </Typography>

      <Button
        variant="contained"
        startIcon={<FolderIcon />}
        sx={{ textTransform: "none", borderRadius: 2 }}
        onClick={() =>
          navigate(`/dashboard/workspaces/${currentWorkspace.id}/projects/create`)
        }
      >
        Create Project
      </Button>
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
            transition: "0.2s",
            "&:hover": {
              boxShadow: 3,
              transform: "translateY(-2px)",
            },
          }}
          onClick={() =>
            navigate(
              `/dashboard/workspaces/${currentWorkspace.id}/projects/${project.id}`
            )
          }
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Avatar sx={{ width: 42, height: 42 }}>
              <FolderIcon />
            </Avatar>

            <Box>
              <Typography sx={{ fontWeight: 700 }}>
                {project.name}
              </Typography>

              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Created by {project.createdBy}
              </Typography>
            </Box>
          </Box>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {project.description || "No description provided."}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              size="small"
              label={
                project.status === "ACTIVE"
                  ? "Active"
                  : project.status === "COMPLETE"
                  ? "Completed"
                  : "Archived"
              }
              color={
                project.status === "COMPLETE"
                  ? "success"
                  : project.status === "ACTIVE"
                  ? "warning"
                  : "default"
              }
              sx={{ fontWeight: 600 }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
</Paper>
<Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
    }}
  >
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Workspace Members
      </Typography>

      <Typography color="text.secondary">
        Members available to work on projects in this workspace.
      </Typography>
    </Box>
    <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
    }}
  >
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Workspace Members
      </Typography>

      <Typography color="text.secondary">
        Add users to this workspace so they can work on projects and tasks.
      </Typography>
    </Box>
  </Box>

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
      sx={{ minWidth: 320 }}
    >
      {users.map((member) => (
        <MenuItem key={member.id} value={String(member.id)}>
          {member.firstName} {member.lastName} - {member.email}
        </MenuItem>
      ))}
    </TextField>

    <Button
      variant="contained"
      onClick={handleAddMember}
      disabled={!selectedUserId}
      sx={{
        height: 56,
        borderRadius: 2,
        textTransform: "none",
        px: 3,
      }}
    >
      Add Member
    </Button>
  </Box>

  {users.length === 0 && (
    <Typography color="text.secondary" sx={{ mt: 2 }}>
      No users available. Create users first before adding members to a workspace.
    </Typography>
  )}
</Paper>
    <Chip
      icon={<GroupsIcon />}
      label={`${users.length} Members`}
      color="primary"
      variant="outlined"
      sx={{ fontWeight: 600 }}
    />
  </Box>

  {users.length === 0 ? (
    <Box
      sx={{
        border: "1px dashed #d1d5db",
        borderRadius: 3,
        p: 4,
        textAlign: "center",
      }}
    >
      <GroupsIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />

      <Typography sx={{ fontWeight: 600 }}>No members found</Typography>

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
      {users.map((member) => (
        <Paper
          key={member.id}
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 44, height: 44 }}>
              {getInitials(member.firstName, member.lastName)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }}>
                {member.firstName} {member.lastName}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 15 }} color="disabled" />
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: 13,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 220,
                  }}
                >
                  {member.email}
                </Typography>
              </Box>
            </Box>
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
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Paper>
      ))}
    </Box>
  )}
</Paper>
    </Box>
  );
}