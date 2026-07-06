import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../context/AuthContext";

export default function MemberSideBar(): React.JSX.Element {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: 280,
        minHeight: "100vh",
        bgcolor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ height: 80, display: "flex", alignItems: "center", px: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          ProjectManager
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 2, py: 3 }}>
        <ListItemButton
          sx={{ borderRadius: 2, mb: 1 }}
          onClick={() => navigate("/dashboard")}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          sx={{ borderRadius: 2, mb: 1 }}
          onClick={() => navigate("/dashboard/users")}
        >
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="Members" />
        </ListItemButton>

        <ListItemButton
          sx={{ borderRadius: 2, mb: 1 }}
          onClick={() => navigate("/dashboard/workspaces")}
        >
          <ListItemIcon>
            <WorkspacesIcon />
          </ListItemIcon>
          <ListItemText primary="My Workspaces" />
        </ListItemButton>

        <ListItemButton
          sx={{ borderRadius: 2, mb: 1 }}
          onClick={() => navigate("/dashboard/projects")}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="My Projects" />
        </ListItemButton>

        <ListItemButton
          sx={{ borderRadius: 2, mb: 1 }}
          onClick={() => navigate("/dashboard/tasks")}
        >
          <ListItemIcon>
            <TaskAltIcon />
          </ListItemIcon>
          <ListItemText primary="My Tasks" />
        </ListItemButton>

        <ListItemButton sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar>{user?.firstName?.charAt(0) ?? "U"}</Avatar>

          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              {user?.firstName} {user?.lastName}
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>

        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2, color: "error.main" }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );
}