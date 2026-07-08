import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { useUsers } from "../../context/UsersContext";
import { updateUser } from "../../services/userServices";

type UserRole = "ADMIN" | "PROJECT_MANAGER" | "MEMBER";

export default function EditUser(): React.JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();

  const { fetchUsers, fetchUserById, currentUser } = useUsers();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchUserById(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setEmail(currentUser.email);
      setRole(currentUser.role as UserRole);
    }
  }, [currentUser]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!id) {
      alert("User id is missing");
      return;
    }

    try {
      setSubmitting(true);

      await updateUser(Number(id), {
        firstName,
        lastName,
        email,
        role,
      });

      await fetchUsers();

      alert("User updated successfully");

      navigate(`/dashboard/users/${id}`);
    } catch (error) {
      alert("Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/dashboard/users/${id}`)}
          sx={{
            mb: 1,
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          Back to User
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Edit User
        </Typography>

        <Typography color="text.secondary">
          Update user profile information and system role.
        </Typography>
      </Box>

      <Container maxWidth="md" disableGutters>
        <Paper
          sx={{
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            overflow: "hidden",
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
                User Information
              </Typography>

              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Edit basic profile details and access role.
              </Typography>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
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
            <TextField
              required
              fullWidth
              label="First Name"
              autoComplete="given-name"
              autoFocus
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setFirstName(e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              required
              fullWidth
              label="Last Name"
              autoComplete="family-name"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setLastName(e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setEmail(e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              required
              fullWidth
              select
              label="Role"
              value={role}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setRole(e.target.value as UserRole)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="PROJECT_MANAGER">Project Manager</MenuItem>
              <MenuItem value="MEMBER">Member</MenuItem>
            </TextField>

            <Box
              sx={{
                gridColumn: {
                  xs: "span 1",
                  md: "span 2",
                },
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(`/dashboard/users/${id}`)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 3,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 3,
                  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
                }}
              >
                {submitting ? "Updating..." : "Update User"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}