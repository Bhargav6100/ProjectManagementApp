import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useUsers } from "../../context/UsersContext";
import { useWorkspaces } from "../../context/WorkspaceContext";
import { useProjects } from "../../context/ProjectContext";
import { useTasks } from "../../context/TaskContext";
import SelectWorkspaceDialog from "../../components/common/SelectWorkspaceDialog";
import SelectProjectDialog from "../../components/common/SelectProjectDialog";
export default function DashboardContents(): React.JSX.Element {
  const {users,inActiveUsers} = useUsers();
  const {workspaces,fetchWorkspaces} = useWorkspaces();
  const {allProjects,fetchAllProjects} = useProjects();
  const {allTasks,fetchAllTasks}=useTasks();
  const navigate = useNavigate();
  const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);
  const [taskDialogOpen,setTaskDialogOpen] = useState<boolean>(false);
  
  useEffect(()=>{
    fetchWorkspaces();
    fetchAllProjects();
    fetchAllTasks();
  },[])
    return (
     <> 
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
        <Paper onClick={(()=>navigate("/dashboard/users"))} sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Total Users</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {users?.length}
          </Typography>
        </Paper>
          <Paper onClick={(()=>navigate("/dashboard/users"))} sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Total Inactive Users</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {inActiveUsers?.length}
          </Typography>
        </Paper>

        <Paper onClick={(()=>navigate("/dashboard/workspaces"))} sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Workspaces</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {workspaces.length}
          </Typography>
        </Paper>

        <Paper onClick={(()=>navigate("/dashboard/projects"))} sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Projects</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
           {allProjects.length}
          </Typography>
        </Paper>

        <Paper onClick={(()=>navigate("/dashboard/tasks"))} sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Tasks</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {allTasks.length}
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Quick Actions
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button  onClick={() => navigate('/dashboard/users/create')} variant="contained" startIcon={<PersonAddIcon />}>
            Add User
          </Button>

          <Button onClick={() => navigate('/dashboard/workspaces/create')} variant="outlined" startIcon={<WorkspacesIcon />}>
            Create Workspace
          </Button>

         <Button variant="outlined" onClick={() => setProjectDialogOpen(true)} startIcon={<FolderIcon />}>
           Create Project
         </Button>

          <Button variant="outlined" onClick={() => setTaskDialogOpen(true)} startIcon={<TaskAltIcon />}>
            Create Task
          </Button>
        </Box>
      </Paper>
    </Box>
   <SelectWorkspaceDialog
      open={projectDialogOpen}
      title="Create Project"
      description="Choose the workspace where this project should be created."
      continueLabel="Continue"
      onClose={() => setProjectDialogOpen(false)}
      onContinue={(workspaceId: number): void => {
    navigate(`/dashboard/workspaces/${workspaceId}/projects/create`);
  }}
/>
<SelectProjectDialog
      open={taskDialogOpen}
      title="Create Task"
      description="Choose the project where this task should be created."
      continueLabel="Continue"
      onClose={() => setTaskDialogOpen(false)}
      onContinue={(workspaceId:number,projectId: number): void => {
    navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/create`);
  }}
  />
</>
  );
}