import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export default function DashboardContents(): React.JSX.Element {
  const navigate = useNavigate();
    return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Total Users</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            0
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Workspaces</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            0
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Projects</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            0
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Tasks</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            0
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Quick Actions
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button  onClick={() => navigate('/signup')} variant="contained" startIcon={<PersonAddIcon />}>
            Add User
          </Button>

          <Button variant="outlined" startIcon={<WorkspacesIcon />}>
            Create Workspace
          </Button>

          <Button variant="outlined" startIcon={<FolderIcon />}>
            Create Project
          </Button>

          <Button variant="outlined" startIcon={<TaskAltIcon />}>
            Create Task
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}