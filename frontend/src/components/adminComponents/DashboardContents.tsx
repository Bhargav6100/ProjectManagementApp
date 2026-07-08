import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";
import { useWorkspaces } from "../../context/WorkspaceContext";
import { useProjects } from "../../context/ProjectContext";
import { useTasks } from "../../context/TaskContext";
import SelectWorkspaceDialog from "../../components/common/SelectWorkspaceDialog";
import SelectProjectDialog from "../../components/common/SelectProjectDialog";

export default function DashboardContents(): React.JSX.Element {
  const { users, inActiveUsers } = useUsers();
  const {user} =useAuth();
  const { workspaces, fetchWorkspaces } = useWorkspaces();
  const { allProjects, fetchAllProjects } = useProjects();
  const { allTasks, fetchAllTasks } = useTasks();

  const navigate = useNavigate();

  const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchWorkspaces();
    fetchAllProjects();
    fetchAllTasks();
  }, []);

  const completedTasks = useMemo(() => {
    return allTasks.filter((task) => task.taskStatus === "DONE").length;
  }, [allTasks]);

  const openTasks = useMemo(() => {
    return allTasks.filter((task) => task.taskStatus !== "DONE").length;
  }, [allTasks]);

  const recentUsers = useMemo(() => {
    return [...users].slice(0, 4);
  }, [users]);

  const recentProjects = useMemo(() => {
    return [...allProjects].slice(0, 4);
  }, [allProjects]);

  const recentTasks = useMemo(() => {
    return [...allTasks].slice(0, 4);
  }, [allTasks]);

  const getStatusColor = (
    status: string
  ): "warning" | "info" | "success" | "default" => {
    if (status === "TO_DO") return "warning";
    if (status === "IN_PROGRESS") return "info";
    if (status === "DONE") return "success";

    return "default";
  };

  const formatStatus = (status: string): string => {
    if (status === "TO_DO") return "To Do";
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "DONE") return "Done";

    return status;
  };

  const statCards = [
    {
      label: "Total Users",
      value: users?.length ?? 0,
      icon: <GroupsIcon />,
      path: "/dashboard/users",
    },
    {
      label: "Inactive Users",
      value: inActiveUsers?.length ?? 0,
      icon: <AdminPanelSettingsIcon />,
      path: "/dashboard/users",
    },
    {
      label: "Workspaces",
      value: workspaces.length,
      icon: <WorkspacesIcon />,
      path: "/dashboard/workspaces",
    },
    {
      label: "Projects",
      value: allProjects.length,
      icon: <FolderIcon />,
      path: "/dashboard/projects",
    },
    {
      label: "Tasks",
      value: allTasks.length,
      icon: <TaskAltIcon />,
      path: "/dashboard/tasks",
    },
    {
      label: "Open Tasks",
      value: openTasks,
      icon: <TaskAltIcon />,
      path: "/dashboard/tasks",
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      icon: <TaskAltIcon />,
      path: "/dashboard/tasks",
    },
  ];

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Dashboard Overview
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Welcome back, {user?.firstName}, Manage users, workspaces, projects, and tasks from one place.
            </Typography>
          </Box>

          <Chip
            label="Admin Control Center"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, borderRadius: 2 }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 3,
          }}
        >
          {statCards.map((card) => (
            <Paper
              key={card.label}
              onClick={() => navigate(card.path)}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: "pointer",
                border: "1px solid #eef0f4",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                transition: "0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.10)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                    {card.label}
                  </Typography>

                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: "rgba(25, 118, 210, 0.10)",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 3,
            border: "1px solid #eef0f4",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Quick Actions
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              onClick={() => navigate("/dashboard/users/create")}
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                py: 1,
                fontWeight: 700,
              }}
            >
              Add User
            </Button>

            <Button
              onClick={() => navigate("/dashboard/workspaces/create")}
              variant="outlined"
              startIcon={<WorkspacesIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                py: 1,
                fontWeight: 700,
              }}
            >
              Create Workspace
            </Button>

            <Button
              variant="outlined"
              onClick={() => setProjectDialogOpen(true)}
              startIcon={<FolderIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                py: 1,
                fontWeight: 700,
              }}
            >
              Create Project
            </Button>

            <Button
              variant="outlined"
              onClick={() => setTaskDialogOpen(true)}
              startIcon={<TaskAltIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                py: 1,
                fontWeight: 700,
              }}
            >
              Create Task
            </Button>
          </Box>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #eef0f4",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Recent Users
              </Typography>

              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/dashboard/users")}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                View All
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {recentUsers.length === 0 && (
              <Typography color="text.secondary">No users found.</Typography>
            )}

            {recentUsers.map((user) => (
              <Box
                key={user.id}
                onClick={() => navigate(`/dashboard/users/${user.id}`)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.2,
                  cursor: "pointer",
                  borderRadius: 2,
                  px: 1,
                  "&:hover": {
                    bgcolor: "#f9fafb",
                  },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    {user.firstName} {user.lastName}
                  </Typography>

                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    {user.email}
                  </Typography>
                </Box>

                <Chip
                  label={user.role}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            ))}
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #eef0f4",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Recent Projects
              </Typography>

              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/dashboard/projects")}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                View All
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {recentProjects.length === 0 && (
              <Typography color="text.secondary">No projects found.</Typography>
            )}

            {recentProjects.map((project) => (
              <Box
                key={project.id}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  px: 1,
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {project.name}
                </Typography>

                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                  Status: {project.status}
                </Typography>
              </Box>
            ))}
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #eef0f4",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Recent Tasks
              </Typography>

              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/dashboard/tasks")}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                View All
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {recentTasks.length === 0 && (
              <Typography color="text.secondary">No tasks found.</Typography>
            )}

            {recentTasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  py: 1.2,
                  borderRadius: 2,
                  px: 1,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    {task.title}
                  </Typography>

                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    Priority: {task.taskPriority}
                  </Typography>
                </Box>

                <Chip
                  label={formatStatus(task.taskStatus)}
                  color={getStatusColor(task.taskStatus)}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
            ))}
          </Paper>
        </Box>
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
        onContinue={(workspaceId: number, projectId: number): void => {
          navigate(
            `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/create`
          );
        }}
      />
    </>
  );
}