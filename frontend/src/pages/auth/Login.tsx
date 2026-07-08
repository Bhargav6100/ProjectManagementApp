import React, { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";

import { loginUser, getCurrentUser } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { login, setUser } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const data = await loginUser(email, password);

      login(data.token);

      const userData = await getCurrentUser();

      setUser(userData);

      setEmail("");
      setPassword("");

      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Paper
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
          }}
        >
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              borderBottom: "1px solid #e5e7eb",
              bgcolor: "#ffffff",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                bgcolor: "#e0e7ff",
                color: "#3730a3",
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>

            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
              Worksync
            </Typography>

            <Typography color="text.secondary">
              Access your project management dashboard.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 4,
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              required
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setEmail(e.target.value)
              }
              sx={{
                mb: 2,
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
              autoComplete="current-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPassword(e.target.value)
              }
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              startIcon={<DashboardIcon />}
              sx={{
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 800,
                boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
              }}
            >
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </Paper>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ mt: 2, fontSize: 13 }}
        >
          Project Management Application
        </Typography>
      </Container>
    </Box>
  );
}