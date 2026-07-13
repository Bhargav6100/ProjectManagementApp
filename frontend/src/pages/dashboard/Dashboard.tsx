import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import AdminPanel from "./AdminPanel";
import ProjectManagerPanel from "./ProjectManagerPanel";
 import MemberPanel from "./MemberPanel";

export default function Dashboard(): React.JSX.Element {
  const { user, loading} = useAuth();

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
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>User not found. Please login again.</Typography>
      </Box>
    );
  }

  if (user.role === "ADMIN") {
    return <AdminPanel />;
  }

  if (user.role === "PROJECT_MANAGER") {
    return <ProjectManagerPanel/>;
  
  }

  if (user.role === "MEMBER") {
    return <div><MemberPanel/></div>;
  }

  return  (
    <Box sx={{ p: 3 }}>
      <Typography>Invalid user role.</Typography>
    </Box>
  );;
}

