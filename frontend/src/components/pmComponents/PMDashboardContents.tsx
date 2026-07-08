import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import PersonIcon from "@mui/icons-material/Person";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { useUsers } from "../../context/UsersContext";
import { useWorkspaces } from "../../context/WorkspaceContext";
import { useProjects } from "../../context/ProjectContext";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";

import SelectWorkspaceDialog from "../../components/common/SelectWorkspaceDialog";
import SelectProjectDialog from "../../components/common/SelectProjectDialog";

export default function PMDashboardContents(): React.JSX.Element {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { users } = useUsers();
  const { workspaces, fetchMyWorkspaces } = useWorkspaces();
  const { allProjects, fetchMyProjects } = useProjects();
  const {
    allTasks,
    myCreatedTasks,
    fetchMyTasks,
    fetchMyAssignedTasks,
  } = useTasks();

  const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchMyWorkspaces();
    fetchMyProjects();
    fetchMyTasks();
    fetchMyAssignedTasks();
  }, []);

  const myWorkspaces = useMemo(() => {
    return workspaces;
  }, [workspaces]);


  const myWorkspaceIds = new Set(workspaces.map((workspace) => workspace.id));

  const myProjects = allProjects.filter((project) =>
    myWorkspaceIds.has(project.workspaceId)
  );

  const myProjectIds = useMemo(() => {
    return new Set(myProjects.map((project) => project.id));
  }, [myProjects]);

  const myTasks = useMemo(() => {
    const currentUserId = user?.id;

    return allTasks.filter((task) => {
      const taskBelongsToMyProject = myProjectIds.has(task.projectId);

      const assignedToMe = task.assignedToUserId === currentUserId;

      return taskBelongsToMyProject && assignedToMe;
    });
  }, [allTasks, myProjectIds, user]);

  const assignedToMeTasks = useMemo(() => {
    return myTasks.filter((task) => task.assignedToUserId === user?.id);
  }, [myTasks, user]);

  const statCardSx = {
    p: 3,
    borderRadius: 3,
    cursor: "pointer",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
      borderColor: "rgba(25, 118, 210, 0.35)",
    },
  };

  const iconBoxSx = {
    width: 48,
    height: 48,
    borderRadius: 2.5,
    bgcolor: "rgba(25, 118, 210, 0.08)",
    color: "primary.main",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    "& svg": {
      fontSize: 26,
    },
  };

  return (
    <>
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Project Manager Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: 15 }}>
            Welcome back, {user?.firstName}. Manage your workspaces, projects,
            and tasks from here.
          </Typography>
        </Box>

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
          <Paper onClick={() => navigate("/dashboard/users")} sx={statCardSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={iconBoxSx}>
                <PersonIcon />
              </Box>

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Users
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {users.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            onClick={() => navigate("/dashboard/workspaces")}
            sx={statCardSx}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={iconBoxSx}>
                <WorkspacesIcon />
              </Box>

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  My Workspaces
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {myWorkspaces.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            onClick={() => navigate("/dashboard/projects")}
            sx={statCardSx}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={iconBoxSx}>
                <FolderIcon />
              </Box>

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  My Projects
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {myProjects.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper onClick={() => navigate("/dashboard/tasks")} sx={statCardSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={iconBoxSx}>
                <TaskAltIcon />
              </Box>

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  My Tasks
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {myTasks.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 3,
            mb: 3,
          }}
        >
          <Paper
            onClick={() => navigate("/dashboard/my-tasks")}
            sx={statCardSx}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={iconBoxSx}>
                <TaskAltIcon />
              </Box>

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Tasks Assigned To Me
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {assignedToMeTasks.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            onClick={() => navigate("/dashboard/my-assigned-tasks")}
            sx={statCardSx}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={iconBoxSx}>
                <TaskAltIcon />
              </Box>

              <Box>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Tasks Created By Me
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {myCreatedTasks.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
            Quick Actions
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2.5 }}>
            Start new project work from your assigned resources.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<FolderIcon />}
              onClick={() => setProjectDialogOpen(true)}
              sx={{
                borderRadius: 2.5,
                px: 2.5,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Create Project
            </Button>

            <Button
              variant="outlined"
              startIcon={<TaskAltIcon />}
              onClick={() => setTaskDialogOpen(true)}
              sx={{
                borderRadius: 2.5,
                px: 2.5,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Create Task
            </Button>
          </Box>
        </Paper>
      </Box>

      <SelectWorkspaceDialog
        open={projectDialogOpen}
        title="Create Project"
        description="Choose one of your workspaces where this project should be created."
        continueLabel="Continue"
        onClose={() => setProjectDialogOpen(false)}
        onContinue={(workspaceId: number): void => {
          navigate(`/dashboard/workspaces/${workspaceId}/projects/create`);
        }}
      />

      <SelectProjectDialog
        open={taskDialogOpen}
        title="Create Task"
        description="Choose one of your projects where this task should be created."
        continueLabel="Continue"
        onClose={() => setTaskDialogOpen(false)}
        onContinue={(workspaceId: number, projectId: number): void => {
          navigate(
            `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/create`
          );
        }}
      />
    </>
  );
}