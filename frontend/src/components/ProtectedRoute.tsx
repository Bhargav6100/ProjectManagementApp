import { Navigate,Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute(): React.JSX.Element {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {" "}
        <CircularProgress />{" "}
      </Box>
    );
  }
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
   return <Outlet />;
}
