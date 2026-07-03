import { Box } from "@mui/material";
import PMLeftAside from "../../components/pmComponents/PMLeftAside";
import PMDashboardContents from "../../components/pmComponents/PMDashboardContents";
import { useAuth } from "../../context/AuthContext";

export default function ProjectManagerPanel(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <PMLeftAside />

      <Box sx={{ flexGrow: 1, bgcolor: "#f5f7fb", minHeight: "100vh" }}>
        <Box
          sx={{
            height: 80,
            bgcolor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 4,
          }}
        >
          <h2>Dashboard</h2>
          <p>Hello, {user?.firstName}</p>
        </Box>

        <Box sx={{ p: 4 }}>
          <PMDashboardContents />
        </Box>
      </Box>
    </Box>
  );
}