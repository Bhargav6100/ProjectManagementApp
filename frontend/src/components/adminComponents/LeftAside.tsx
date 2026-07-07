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

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import GroupsIcon from "@mui/icons-material/Groups";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../context/AuthContext";
import SelectWorkspaceDialog from "../common/SelectWorkspaceDialog";
import SelectProjectDialog from "../common/SelectProjectDialog";

export default function AdminSideBar(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const [workspaceDialogOpen, setWorkspaceDialogOpen] =
    useState<boolean>(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);

  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string): boolean => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return location.pathname.startsWith(path);
  };

  const menuItemSx = (active: boolean) => ({
    borderRadius: 2.5,
    mb: 1,
    px: 2,
    py: 1.2,
    color: active ? "primary.main" : "text.primary",
    bgcolor: active ? "rgba(25, 118, 210, 0.08)" : "transparent",
    "&:hover": {
      bgcolor: active ? "rgba(25, 118, 210, 0.12)" : "#f3f4f6",
    },
  });

  const iconSx = (active: boolean) => ({
    color: active ? "primary.main" : "text.secondary",
    minWidth: 42,
  });

  return (
    <>
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
        <Box
          sx={{
            height: 80,
            display: "flex",
            alignItems: "center",
            px: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              WorkSync
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Project Management
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List sx={{ px: 2, py: 3 }}>
          <ListItemButton
            sx={menuItemSx(isActive("/dashboard"))}
            onClick={() => navigate("/dashboard")}
          >
            <ListItemIcon sx={iconSx(isActive("/dashboard"))}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
               primary={
             <Typography sx={{ fontWeight: 600 }}>
                Dashboard
               </Typography>
              }
            />
          </ListItemButton>

          <ListItemButton
            sx={menuItemSx(isActive("/dashboard/users"))}
            onClick={() => navigate("/dashboard/users")}
          >
            <ListItemIcon sx={iconSx(isActive("/dashboard/users"))}>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText
              primary={
               <Typography sx={{ fontWeight: 600 }}>
            Users
               </Typography>
          } 
            />
          </ListItemButton>

          <ListItemButton
            sx={menuItemSx(isActive("/dashboard/workspaces"))}
            onClick={() => navigate("/dashboard/workspaces")}
          >
            <ListItemIcon sx={iconSx(isActive("/dashboard/workspaces"))}>
              <WorkspacesIcon />
            </ListItemIcon>
            <ListItemText
              primary={
        <Typography sx={{ fontWeight: 600 }}>
         Workspaces
          </Typography>
  }
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => setWorkspaceDialogOpen(true)}
            sx={menuItemSx(isActive("/dashboard/projects"))}
          >
            <ListItemIcon sx={iconSx(isActive("/dashboard/projects"))}>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText
               primary={
    <Typography sx={{ fontWeight: 600 }}>
      Projects
    </Typography>
  }
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => setProjectDialogOpen(true)}
            sx={menuItemSx(isActive("/dashboard/tasks"))}
          >
            <ListItemIcon sx={iconSx(isActive("/dashboard/tasks"))}>
              <TaskAltIcon />
            </ListItemIcon>
            <ListItemText
              primary={
    <Typography sx={{ fontWeight: 600 }}>
      Tasks
    </Typography>
  }
            />
          </ListItemButton>

          <ListItemButton sx={menuItemSx(false)}>
            <ListItemIcon sx={iconSx(false)}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
               primary={
    <Typography sx={{ fontWeight: 600 }}>
      Settings
    </Typography>
  }
            />
          </ListItemButton>
        </List>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#f9fafb",
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", fontWeight: 700 }}>
              {user?.firstName?.charAt(0) ?? "U"}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                {user?.firstName} {user?.lastName}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ fontSize: 12, letterSpacing: 0.4 }}
              >
                {user?.role}
              </Typography>
            </Box>
          </Box>

          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2.5,
              color: "error.main",
              "&:hover": {
                bgcolor: "rgba(211, 47, 47, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "error.main", minWidth: 42 }}>
              <LogoutIcon />
            </ListItemIcon>

            <ListItemText
               primary={
    <Typography sx={{ fontWeight: 600 }}>
      Log Out
    </Typography>
  }
            />
          </ListItemButton>
        </Box>
      </Box>

      <SelectWorkspaceDialog
        open={workspaceDialogOpen}
        title="Select Workspace"
        description="Choose a workspace to view its projects."
        continueLabel="Open Workspace"
        onClose={() => setWorkspaceDialogOpen(false)}
        onContinue={(workspaceId: number): void => {
          navigate(`/dashboard/workspaces/${workspaceId}`);
        }}
      />

      <SelectProjectDialog
        open={projectDialogOpen}
        title="Select Project"
        description="Choose a Project to view its tasks."
        continueLabel="Open Project"
        onClose={() => setProjectDialogOpen(false)}
        onContinue={(workspaceId: number, projectId: number): void => {
          navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`);
        }}
      />
    </>
  );
}