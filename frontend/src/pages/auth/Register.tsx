import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { registerUser } from "../../services/authServices";
import { useUsers } from "../../context/UsersContext";

type UserRole = "ADMIN" | "PROJECT_MANAGER" | "MEMBER";

export default function Register(): React.JSX.Element {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { fetchUsers } = useUsers();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await registerUser({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      await fetchUsers();

      alert("User created successfully");
      navigate("/dashboard/users");
    } catch (error) {
      alert("Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/users")}
          sx={{
            mb: 1,
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          Back to Users
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Add New User
        </Typography>

        <Typography color="text.secondary">
          Create a new user account and assign a system role.
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
              <PersonAddIcon />
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                User Information
              </Typography>

              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Enter basic profile details and access role.
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
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPassword(e.target.value)
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
                gridColumn: {
                  xs: "span 1",
                  md: "span 2",
                },
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
                onClick={() => navigate("/dashboard/users")}
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
                {submitting ? "Creating..." : "Add User"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}