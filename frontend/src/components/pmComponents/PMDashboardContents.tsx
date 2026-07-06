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
  const { allTasks, fetchAllTasks } = useTasks();

  const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchMyWorkspaces();
    fetchMyProjects();
    fetchAllTasks();
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
    const currentUserEmail = user?.email;

    const currentUserFullName = `${user?.firstName ?? ""} ${
      user?.lastName ?? ""
    }`.trim();

    return allTasks.filter((task) => {
      const taskBelongsToMyProject = myProjectIds.has(task.projectId);

      const assignedToMe = task.assignedToUserId === currentUserId;

      const createdByMe =
        task.createdBy === currentUserEmail ||
        task.createdBy === currentUserFullName;

      return taskBelongsToMyProject && (assignedToMe || createdByMe);
    });
  }, [allTasks, myProjectIds, user]);

  const assignedToMeTasks = useMemo(() => {
    return myTasks.filter((task) => task.assignedToUserId === user?.id);
  }, [myTasks, user]);

  const createdByMeTasks = useMemo(() => {
    const currentUserEmail = user?.email;

    const currentUserFullName = `${user?.firstName ?? ""} ${
      user?.lastName ?? ""
    }`.trim();

    return myTasks.filter(
      (task) =>
        task.createdBy === currentUserEmail ||
        task.createdBy === currentUserFullName
    );
  }, [myTasks, user]);

  return (
    <>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Project Manager Dashboard
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
          <Paper
            onClick={() => navigate("/dashboard/users")}
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PersonIcon color="primary" />

              <Box>
                <Typography color="text.secondary">Users</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {users.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            onClick={() => navigate("/dashboard/workspaces")}
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <WorkspacesIcon color="primary" />

              <Box>
                <Typography color="text.secondary">My Workspaces</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {myWorkspaces.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            onClick={() => navigate("/dashboard/projects")}
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FolderIcon color="primary" />

              <Box>
                <Typography color="text.secondary">My Projects</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {myProjects.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            onClick={() => navigate("/dashboard/tasks")}
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <TaskAltIcon color="primary" />

              <Box>
                <Typography color="text.secondary">My Tasks</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
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
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography color="text.secondary">Tasks Assigned To Me</Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {assignedToMeTasks.length}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography color="text.secondary">Tasks Created By Me</Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {createdByMeTasks.length}
            </Typography>
          </Paper>
        </Box>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Quick Actions
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<FolderIcon />}
              onClick={() => setProjectDialogOpen(true)}
            >
              Create Project
            </Button>

            <Button
              variant="outlined"
              startIcon={<TaskAltIcon />}
              onClick={() => setTaskDialogOpen(true)}
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