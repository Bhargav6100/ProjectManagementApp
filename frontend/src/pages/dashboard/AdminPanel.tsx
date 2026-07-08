import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LeftAside from "../../components/adminComponents/LeftAside";
import { useAuth } from "../../context/AuthContext";

export default function AdminPanel(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <LeftAside />

      <Box sx={{ flexGrow: 1, bgcolor: "#f5f7fb", minHeight: "100vh" }}>
        <Box
          sx={{
            height: 80,
            bgcolor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: 4,
          }}
        >
          <p>Hello, {user?.firstName}</p>
        </Box>

        <Box sx={{ p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}