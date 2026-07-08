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

  const [activeSearch, setActiveSearch] = useState<string>("");
  const [inactiveSearch, setInactiveSearch] = useState<string>("");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchUsers();
    fetchInactiveUsers();
  }, []);

  const activeQuery = activeSearch.toLowerCase();
  const inactiveQuery = inactiveSearch.toLowerCase();

  const filteredActiveUsers = useMemo(() => {
    return users.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const email = member.email.toLowerCase();
      const role = member.role.toLowerCase();

      return (
        fullName.includes(activeQuery) ||
        email.includes(activeQuery) ||
        role.includes(activeQuery)
      );
    });
  }, [users, activeQuery]);

  const filteredInactiveUsers = useMemo(() => {
    return inActiveUsers.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const email = member.email.toLowerCase();
      const role = member.role.toLowerCase();

      return (
        fullName.includes(inactiveQuery) ||
        email.includes(inactiveQuery) ||
        role.includes(inactiveQuery)
      );
    });
  }, [inActiveUsers, inactiveQuery]);

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

  const getRoleColor = (role: string): "primary" | "success" | "default" => {
    if (role === "ADMIN") {
      return "primary";
    }

    if (role === "PROJECT_MANAGER") {
      return "success";
    }

    return "default";
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

  const renderUsersTable = (
    listTitle: string,
    listDescription: string,
    usersList: typeof users,
    status: "ACTIVE" | "INACTIVE",
    searchValue: string,
    onSearchChange: (value: string) => void
  ): React.JSX.Element => {
    return (
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
              {listTitle}
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {listDescription}
            </Typography>
          </Box>

          <Chip
            label={`${usersList.length} users`}
            color={status === "ACTIVE" ? "success" : "default"}
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#f9fafb",
          }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder={`Search ${
              status === "ACTIVE" ? "active" : "inactive"
            } users by name, email, or role...`}
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              onSearchChange(e.target.value)
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
                  bgcolor: "#ffffff",
                },
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  User
                </TableCell>

                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  Email
                </TableCell>

                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  Role
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
                  <TableCell colSpan={5} sx={{ py: 4 }}>
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
                          {getInitials(member.firstName, member.lastName)}
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700 }}>
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

                    <TableCell>
                      <Typography sx={{ fontSize: 14 }}>
                        {member.email}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={formatRole(member.role)}
                        size="small"
                        color={getRoleColor(member.role)}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={status === "ACTIVE" ? "Active" : "Inactive"}
                        size="small"
                        color={status === "ACTIVE" ? "success" : "default"}
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
                          {status === "ACTIVE" && (
                            <Tooltip title="Edit user">
                              <IconButton
                                size="small"
                                onClick={(e): void => {
                                  e.stopPropagation();
                                  navigate(
                                    `/dashboard/users/${member.id}/edit`
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
                          )}

                          {status === "ACTIVE" ? (
                            <Tooltip title="Deactivate user">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e): void => {
                                  e.stopPropagation();
                                  void updateUserStatus(member.id);
                                }}
                                sx={{
                                  bgcolor: "#fff5f5",

                                  "&:hover": {
                                    bgcolor: "rgba(211, 47, 47, 0.08)",
                                  },
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
                                  void updateUserStatus(member.id);
                                }}
                                sx={{
                                  bgcolor: "#f0fdf4",

                                  "&:hover": {
                                    bgcolor: "rgba(46, 125, 50, 0.08)",
                                  },
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
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
                  <TableCell colSpan={5} sx={{ py: 4 }}>
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
            Users
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: 15 }}>
            View users and manage active/inactive system access.
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate("/dashboard/users/create")}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              px: 3,
              py: 1,
              fontWeight: 700,
              boxShadow: "none",
            }}
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
        <Paper sx={summaryCardSx}>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            Active Users
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {users.length}
          </Typography>
        </Paper>

        <Paper sx={summaryCardSx}>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            Inactive Users
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {inActiveUsers.length}
          </Typography>
        </Paper>

        <Paper sx={summaryCardSx}>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            Admins
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {totalAdmins}
          </Typography>
        </Paper>

        <Paper sx={summaryCardSx}>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            Project Managers
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {totalProjectManagers}
          </Typography>
        </Paper>

        <Paper sx={summaryCardSx}>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            Members
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {totalMembers}
          </Typography>
        </Paper>
      </Box>

      {renderUsersTable(
        "Active Users",
        "Users who can currently access the system.",
        filteredActiveUsers,
        "ACTIVE",
        activeSearch,
        setActiveSearch
      )}

      {isAdmin &&
        renderUsersTable(
          "Inactive Users",
          "Users who are deactivated and cannot log in until reactivated.",
          filteredInactiveUsers,
          "INACTIVE",
          inactiveSearch,
          setInactiveSearch
        )}
    </Box>
  );
}