import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetUserPassword } from "../../services/userServices";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockResetIcon from "@mui/icons-material/LockReset";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";
export default function UserDetails(): React.JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [resettingPassword, setResettingPassword] = useState<boolean>(false);
  const { user: loggedInUser } = useAuth();
  const { currentUser, fetchUserById, deleteUser, loading } = useUsers();
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
  const getRoleColor = (role?: string): "primary" | "success" | "default" => {
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
      "Are you sure you want to delete this user?",
    );
    if (!confirmed) return;
    await deleteUser(Number(id));
    navigate("/dashboard/users");
  };
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
            
            Loading user details...
          </Typography>
        </Paper>
      </Box>
    );
  }
  if (!currentUser) {
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
            
            <PersonIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            
            User not found
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            
            The selected user could not be loaded.
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/users")}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
          >
            
            Back to Users
          </Button>
        </Paper>
      </Box>
    );
  }
  const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
  const accessSummary =
    currentUser.role === "ADMIN"
      ? "This user has full system access."
      : currentUser.role === "PROJECT_MANAGER"
        ? "This user can manage assigned workspaces, projects, and tasks."
        : "This user can view assigned workspaces, projects, and update task status.";
  const infoCards = [
    { label: "Email", value: currentUser.email, icon: <EmailIcon /> },
    {
      label: "Role",
      value: formatRole(currentUser.role),
      icon: <AdminPanelSettingsIcon />,
    },
    {
      label: "Created At",
      value: formatDate(currentUser.createdAt),
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
            onClick={() => navigate("/dashboard/users")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              mb: 1,
            }}
          >
            
            Back to Users
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            
            User Details
          </Typography>
          <Typography color="text.secondary">
            
            View profile, role, access, and account information.
          </Typography>
        </Box>
        {isAdmin && (
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() =>
                navigate(`/dashboard/users/${currentUser.id}/edit`)
              }
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
            >
              
              Edit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<LockResetIcon />}
              onClick={() => setResetDialogOpen(true)}
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
            >
              
              Reset Password
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={(): void => {
                void handleDelete();
              }}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 700,
                boxShadow: "0 10px 25px rgba(220, 38, 38, 0.22)",
              }}
            >
              
              Delete
            </Button>
          </Box>
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
                fontSize: 28,
                fontWeight: 800,
                bgcolor: "#e0e7ff",
                color: "#3730a3",
              }}
            >
              
              {getInitials(currentUser.firstName, currentUser.lastName)}
            </Avatar>
            <Box>
              
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                
                {fullName}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                
                {currentUser.email}
              </Typography>
              <Chip
                label={formatRole(currentUser.role)}
                color={getRoleColor(currentUser.role)}
                sx={{ mt: 1.5, fontWeight: 700, borderRadius: 2 }}
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
              
              User ID
            </Typography>
            <Typography sx={{ fontWeight: 800 }}>
              
              #{currentUser.id}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        
        {infoCards.map((card) => (
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
              <Box>
                
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 13, fontWeight: 600 }}
                >
                  
                  {card.label}
                </Typography>
                <Typography sx={{ fontWeight: 800, mt: 0.3 }}>
                  
                  {card.value || "N/A"}
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
          sx={{ p: 2.5, borderBottom: "1px solid #e5e7eb", bgcolor: "#ffffff" }}
        >
          
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            
            User Information
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            
            Basic account and identity details
          </Typography>
        </Box>
        <Box
          sx={{
            p: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2.5,
          }}
        >
          
          <Box>
            
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              
              First Name
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              
              {currentUser.firstName || "N/A"}
            </Typography>
          </Box>
          <Box>
            
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              
              Last Name
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              
              {currentUser.lastName || "N/A"}
            </Typography>
          </Box>
          <Box>
            
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              
              Email Address
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              
              {currentUser.email || "N/A"}
            </Typography>
          </Box>
          <Box>
            
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              
              System Role
            </Typography>
            <Chip
              label={formatRole(currentUser.role)}
              color={getRoleColor(currentUser.role)}
              size="small"
              sx={{ fontWeight: 700, borderRadius: 2, mt: 0.5 }}
            />
          </Box>
        </Box>
      </Paper>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          
          <Avatar
            sx={{ width: 44, height: 44, bgcolor: "#eef2ff", color: "#3730a3" }}
          >
            
            <BadgeIcon />
          </Avatar>
          <Box>
            
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              
              Access Summary
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              
              {accessSummary}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      >
        
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          
          Reset Password
        </DialogTitle>
        <DialogContent>
          
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            
            Set a new temporary password for {currentUser.firstName}
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          
          <Button
            onClick={() => {
              setResetDialogOpen(false);
              setNewPassword("");
              setConfirmPassword("");
            }}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
          >
            
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={(): void => {
              void handleResetPassword();
            }}
            disabled={resettingPassword}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
            }}
          >
            
            {resettingPassword ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
