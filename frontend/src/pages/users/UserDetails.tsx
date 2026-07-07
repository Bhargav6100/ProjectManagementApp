import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetUserPassword } from "../../services/userServices";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockResetIcon from "@mui/icons-material/LockReset";  
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";

export default function UserDetails(): React.JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();

  const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [resettingPassword, setResettingPassword] = useState<boolean>(false);

  const handleResetPassword = async (): Promise<void> => {
  if (!id) return;

  if (!newPassword.trim() || !confirmPassword.trim()) {
    alert("Please enter and confirm the new password");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    setResettingPassword(true);

    await resetUserPassword(Number(id), newPassword);

    alert("Password reset successfully");

    setResetDialogOpen(false);
    setNewPassword("");
    setConfirmPassword("");
  } finally {
    setResettingPassword(false);
  }
};
  const { user: loggedInUser } = useAuth();

  const {
    currentUser,
    fetchUserById,
    deleteUser,
    loading,
  } = useUsers();

  const isAdmin = loggedInUser?.role === "ADMIN";

  useEffect(() => {
    if (!id) return;

    fetchUserById(Number(id));
  }, [id]);

  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0) ?? "";
    const last = lastName?.charAt(0) ?? "";

    const initials = `${first}${last}`.toUpperCase();

    return initials || "U";
  };

  const formatRole = (role?: string): string => {
    if (!role) return "N/A";

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

  const formatDate = (date?: string): string => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString();
  };

  const handleDelete = async (): Promise<void> => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    await deleteUser(Number(id));
    navigate("/dashboard/users");
  };

  if (loading) {
    return (
      <Box>
        <Typography color="text.secondary">Loading user details...</Typography>
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box>
        <Typography>User not found.</Typography>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/users")}
          sx={{ mt: 2, textTransform: "none" }}
        >
          Back to Users
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard/users")}
        sx={{ mb: 3, textTransform: "none" }}
      >
        Back to Users
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {getInitials(currentUser.firstName, currentUser.lastName)}
            </Avatar>

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {currentUser.firstName} {currentUser.lastName}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {currentUser.email}
              </Typography>

              <Chip
                label={formatRole(currentUser.role)}
                color={getRoleColor(currentUser.role)}
                sx={{ mt: 1.5, fontWeight: 600 }}
              />
            </Box>
          </Box>

          {isAdmin && (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() =>
                  navigate(`/dashboard/users/${currentUser.id}/edit`)
                }
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Edit
              </Button>
                <Button
               variant="outlined"
               color="secondary"
                 startIcon={<LockResetIcon />}
                 onClick={() => setResetDialogOpen(true)}
                 sx={{ textTransform: "none", borderRadius: 2 }}
                 >
                   Reset Password
                </Button>
              <Button 
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <EmailIcon color="primary" />

            <Box>
              <Typography color="text.secondary">Email</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {currentUser.email}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AdminPanelSettingsIcon color="primary" />

            <Box>
              <Typography color="text.secondary">Role</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {formatRole(currentUser.role)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CalendarMonthIcon color="primary" />

            <Box>
              <Typography color="text.secondary">Created At</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {formatDate(currentUser.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          User Information
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
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
              First Name
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {currentUser.firstName || "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Last Name
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {currentUser.lastName || "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Email Address
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {currentUser.email || "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              System Role
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {formatRole(currentUser.role)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <BadgeIcon color="primary" />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Access Summary
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {currentUser.role === "ADMIN"
                ? "This user has full system access."
                : currentUser.role === "PROJECT_MANAGER"
                ? "This user can manage assigned workspaces, projects, and tasks."
                : "This user can view assigned workspaces, projects, and update task status."}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Dialog
  open={resetDialogOpen}
  onClose={() => setResetDialogOpen(false)}
  fullWidth
  maxWidth="xs"
>
  <DialogTitle sx={{ fontWeight: 700 }}>
    Reset Password
  </DialogTitle>

  <DialogContent>
    <Typography color="text.secondary" sx={{ mb: 2 }}>
      Set a new temporary password for {currentUser.firstName}{" "}
      {currentUser.lastName}.
    </Typography>

    <TextField
      margin="normal"
      fullWidth
      required
      type="password"
      label="New Password"
      value={newPassword}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
        setNewPassword(e.target.value)
      }
    />

    <TextField
      margin="normal"
      fullWidth
      required
      type="password"
      label="Confirm Password"
      value={confirmPassword}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
        setConfirmPassword(e.target.value)
      }
    />
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 3 }}>
    <Button
      onClick={() => {
        setResetDialogOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      }}
      sx={{ textTransform: "none" }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleResetPassword}
      disabled={resettingPassword}
      sx={{ textTransform: "none", borderRadius: 2 }}
    >
      {resettingPassword ? "Resetting..." : "Reset Password"}
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}