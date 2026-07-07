import { useMemo, useState } from "react";
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

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";

export default function AdminUsers(): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, loading,deleteUser} = useUsers();

  const [search, setSearch] = useState<string>("");

  const isAdmin = user?.role === "ADMIN";

  const filteredUsers = useMemo(() => {
    return users.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const email = member.email.toLowerCase();
      const role = member.role.toLowerCase();
      const query = search.toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        role.includes(query)
      );
    });
  }, [users, search]);

  const totalAdmins = users.filter((member) => member.role === "ADMIN").length;
  const totalProjectManagers = users.filter(
    (member) => member.role === "PROJECT_MANAGER"
  ).length;
  const totalMembers = users.filter((member) => member.role === "MEMBER").length;

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatRole = (role: string): string => {
    if (role === "PROJECT_MANAGER") {
      return "Project Manager";
    }

    return role.charAt(0) + role.slice(1).toLowerCase();
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
            Users
          </Typography>
          <Typography color="text.secondary">
            View all users and manage system access.
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate("/dashboard/users/create")}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Add User
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
        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Total Users</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {users.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Admins</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {totalAdmins}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Project Managers</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {totalProjectManagers}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Members</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {totalMembers}
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
            User Directory
          </Typography>

          <TextField
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            sx={{ width: 300 }}
            slotProps={{
                input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary">
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredUsers.map((member) => (
                  <TableRow
                    key={member.email}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {getInitials(member.firstName, member.lastName)}
                        </Avatar>

                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {member.firstName} {member.lastName}
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                            {member.role === "ADMIN"
                              ? "System administrator"
                              : member.role === "PROJECT_MANAGER"
                              ? "Manages projects"
                              : "Project member"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>{member.email}</TableCell>

                    <TableCell>
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
                    </TableCell>

                    <TableCell align="right">
                      {isAdmin ? (
                        <>
                          <Tooltip title="Edit user">
                            <IconButton size="small"
                            onClick={() => navigate(`/dashboard/users/${member.id}/edit`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete user">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteUser(member.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                          View only
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary">
                      No users found.
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