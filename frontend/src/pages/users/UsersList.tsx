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

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";

export default function UsersList(): React.JSX.Element {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    users,
    inActiveUsers,
    fetchUsers,
    fetchInactiveUsers,
    loading,
    updateUserStatus,
  } = useUsers();

  const [search, setSearch] = useState<string>("");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchUsers();
    fetchInactiveUsers();
  }, []);

  const query = search.toLowerCase();

  const filteredActiveUsers = useMemo(() => {
    return users.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const email = member.email.toLowerCase();
      const role = member.role.toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        role.includes(query)
      );
    });
  }, [users, query]);

  const filteredInactiveUsers = useMemo(() => {
    return inActiveUsers.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const email = member.email.toLowerCase();
      const role = member.role.toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        role.includes(query)
      );
    });
  }, [inActiveUsers, query]);

  const totalAdmins = users.filter((member) => member.role === "ADMIN").length;

  const totalProjectManagers = users.filter(
    (member) => member.role === "PROJECT_MANAGER"
  ).length;

  const totalMembers = users.filter((member) => member.role === "MEMBER").length;

  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0) ?? "";
    const last = lastName?.charAt(0) ?? "";

    return `${first}${last}`.toUpperCase() || "U";
  };

  const formatRole = (role: string): string => {
    if (role === "PROJECT_MANAGER") {
      return "Project Manager";
    }

    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const getRoleDescription = (role: string): string => {
    if (role === "ADMIN") {
      return "System administrator";
    }

    if (role === "PROJECT_MANAGER") {
      return "Manages projects";
    }

    return "Project member";
  };

  const getRoleColor = (
    role: string
  ): "primary" | "success" | "default" => {
    if (role === "ADMIN") {
      return "primary";
    }

    if (role === "PROJECT_MANAGER") {
      return "success";
    }

    return "default";
  };


  const renderUsersTable = (
    listTitle: string,
    listDescription: string,
    usersList: typeof users,
    status: "ACTIVE" | "INACTIVE"
  ): React.JSX.Element => {
    return (
      <Paper sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {listTitle}
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {listDescription}
            </Typography>
          </Box>

          <Chip
            label={`${usersList.length} users`}
            color={status === "ACTIVE" ? "success" : "default"}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary">
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                usersList.map((member) => (
                  <TableRow
                    key={member.id}
                    hover
                    onClick={() => navigate(`/dashboard/users/${member.id}`)}
                    sx={{
                      cursor: "pointer",
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {getInitials(member.firstName, member.lastName)}
                        </Avatar>

                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {member.firstName} {member.lastName}
                          </Typography>

                          <Typography
                            color="text.secondary"
                            sx={{ fontSize: 13 }}
                          >
                            {getRoleDescription(member.role)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>{member.email}</TableCell>

                    <TableCell>
                      <Chip
                        label={formatRole(member.role)}
                        size="small"
                        color={getRoleColor(member.role)}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={status === "ACTIVE" ? "Active" : "Inactive"}
                        size="small"
                        color={status === "ACTIVE" ? "success" : "default"}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      {isAdmin ? (
                        <>
                          {status === "ACTIVE" && (
                            <Tooltip title="Edit user">
                              <IconButton
                                size="small"
                                onClick={(e): void => {
                                  e.stopPropagation();
                                  navigate(`/dashboard/users/${member.id}/edit`);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {status === "ACTIVE" ? (
                            <Tooltip title="Deactivate user">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e): void => {
                                  e.stopPropagation();
                                  updateUserStatus(member.id);
                                }}
                              >
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Activate user">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={(e): void => {
                                  e.stopPropagation();
                                   updateUserStatus(member.id);
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      ) : (
                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                          View only
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && usersList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
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
    );
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
            View users and manage active/inactive system access.
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
            md: "repeat(5, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Active Users</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {users.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Inactive Users</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {inActiveUsers.length}
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

      <Paper sx={{ borderRadius: 3, p: 2.5, mb: 3 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search users by name, email, or role..."
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
            },
          }}
        />
      </Paper>

      {renderUsersTable(
        "Active Users",
        "Users who can currently access the system.",
        filteredActiveUsers,
        "ACTIVE"
      )}

      {isAdmin &&
        renderUsersTable(
          "Inactive Users",
          "Users who are deactivated and cannot log in until reactivated.",
          filteredInactiveUsers,
          "INACTIVE"
        )}
    </Box>
  );
}