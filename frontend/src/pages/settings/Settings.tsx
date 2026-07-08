import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import SecurityIcon from "@mui/icons-material/Security";
import InfoIcon from "@mui/icons-material/Info";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

 function Settings(): React.JSX.Element {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const fullName = user ? `${user.firstName} ${user.lastName}` : "User";

  const getInitials = (): string => {
    if (!user) {
      return "U";
    }

    const first = user.firstName?.charAt(0) ?? "";
    const last = user.lastName?.charAt(0) ?? "";

    return `${first}${last}`.toUpperCase() || "U";
  };

  const formatRole = (role?: string): string => {
    if (!role) {
      return "N/A";
    }

    if (role === "PROJECT_MANAGER") {
      return "Project Manager";
    }

    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const getRoleColor = (
    role?: string
  ): "primary" | "success" | "default" => {
    if (role === "ADMIN") {
      return "primary";
    }

    if (role === "PROJECT_MANAGER") {
      return "success";
    }

    return "default";
  };

  const getAccessSummary = (): string => {
    if (user?.role === "ADMIN") {
      return "You have full access to manage users, workspaces, projects, and tasks.";
    }

    if (user?.role === "PROJECT_MANAGER") {
      return "You can manage assigned workspaces, projects, and tasks.";
    }

    return "You can view assigned workspaces, projects, and update your task status.";
  };

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Settings
        </Typography>

        <Typography color="text.secondary">
          Manage your account information and application access.
        </Typography>
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
                fontSize: 28,
                fontWeight: 800,
                bgcolor: "#e0e7ff",
                color: "#3730a3",
              }}
            >
              {getInitials()}
            </Avatar>

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {fullName}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {user?.email}
              </Typography>

              <Chip
                label={formatRole(user?.role)}
                color={getRoleColor(user?.role)}
                sx={{
                  mt: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              boxShadow: "0 10px 25px rgba(220, 38, 38, 0.22)",
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "#eef2ff",
                color: "#3730a3",
              }}
            >
              <PersonIcon />
            </Avatar>

            <Box>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 13, fontWeight: 600 }}
              >
                Name
              </Typography>

              <Typography sx={{ fontWeight: 800 }}>{fullName}</Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "#eef2ff",
                color: "#3730a3",
              }}
            >
              <EmailIcon />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 13, fontWeight: 600 }}
              >
                Email
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "#eef2ff",
                color: "#3730a3",
              }}
            >
              <AdminPanelSettingsIcon />
            </Avatar>

            <Box>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 13, fontWeight: 600 }}
              >
                Role
              </Typography>

              <Typography sx={{ fontWeight: 800 }}>
                {formatRole(user?.role)}
              </Typography>
            </Box>
          </Box>
        </Paper>
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
            alignItems: "center",
            gap: 1.5,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#e0e7ff",
              color: "#3730a3",
            }}
          >
            <SecurityIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Access Summary
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Your current permissions inside the system.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary">{getAccessSummary()}</Typography>
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
            alignItems: "center",
            gap: 1.5,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#e0e7ff",
              color: "#3730a3",
            }}
          >
            <ManageAccountsIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Account Actions
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Quick actions related to your account.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 3,
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            disabled
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
            }}
          >
            Change Password Coming Soon
          </Button>

          {user?.role === "ADMIN" && (
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/users")}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 700,
                px: 3,
              }}
            >
              Manage Users
            </Button>
          )}

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              boxShadow: "0 10px 25px rgba(220, 38, 38, 0.22)",
            }}
          >
            Logout
          </Button>
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
            alignItems: "center",
            gap: 1.5,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#e0e7ff",
              color: "#3730a3",
            }}
          >
            <InfoIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Application Information
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Basic information about this system.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Application
              </Typography>

              <Typography sx={{ fontWeight: 700 }}>
                Project Management Application
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Dashboard Role
              </Typography>

              <Typography sx={{ fontWeight: 700 }}>
                {formatRole(user?.role)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            Settings are role-aware. Available actions may change based on
            whether you are an Admin, Project Manager, or Member.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Settings;