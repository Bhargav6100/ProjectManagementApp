import { Box } from "@mui/material";
import MemberLeftAside from "../../components/adminComponents/LeftAside";
import MemberDashboardContents from "../../components/memberComponents/MemberDashboardContents";
import { useAuth } from "../../context/AuthContext";

export default function AdminPanel(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <MemberLeftAside />

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
          <MemberDashboardContents />
        </Box>
      </Box>
    </Box>
  );
}