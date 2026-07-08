import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";

import GroupsIcon from "@mui/icons-material/Groups";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";
import { useWorkspaces } from "../../context/WorkspaceContext";
import { useProjects } from "../../context/ProjectContext";
import { useTasks } from "../../context/TaskContext";

export default function MemberDashboardContents(): React.JSX.Element {
  const navigate = useNavigate();

  const { users } = useUsers();

  const {user} = useAuth();

  const { workspaces, fetchMyWorkspaces } = useWorkspaces();

  const { allProjects, fetchMyProjects } = useProjects();

  const { allTasks, fetchMyTasks } = useTasks();

  useEffect(() => {
    fetchMyWorkspaces();
    fetchMyProjects();
    fetchMyTasks();
  }, []);

  const pendingTasks = useMemo(() => {
    return allTasks.filter((task) => task.taskStatus === "TO_DO").length;
  }, [allTasks]);

  const inProgressTasks = useMemo(() => {
    return allTasks.filter((task) => task.taskStatus === "IN_PROGRESS").length;
  }, [allTasks]);

  const completedTasks = useMemo(() => {
    return allTasks.filter((task) => task.taskStatus === "DONE").length;
  }, [allTasks]);

  const recentTasks = useMemo(() => {
    return [...allTasks]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [allTasks]);

  const formatStatus = (status: string): string => {
    if (status === "TO_DO") return "Pending";
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "DONE") return "Completed";

    return status;
  };

  const getStatusColor = (
    status: string
  ): "warning" | "info" | "success" | "default" => {
    if (status === "TO_DO") return "warning";
    if (status === "IN_PROGRESS") return "info";
    if (status === "DONE") return "success";

    return "default";
  };

  const findWorkspaceId = (projectId: number): number | undefined => {
    const project = allProjects.find((project) => project.id === projectId);

    return project?.workspaceId;
  };

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

  const simpleCardSx = {
    p: 3,
    borderRadius: 3,
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
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
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Member Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ fontSize: 15 }}>
         Welcome back {user?.firstName}, View your assigned workspaces, projects, and latest tasks.
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
              <GroupsIcon />
            </Box>

            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Members
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
                {workspaces.length}
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
                {allProjects.length}
              </Typography>
            </Box>
          </Box>
        </Paper>

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
                My Tasks
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {allTasks.length}
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
            md: "repeat(3, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <Paper sx={simpleCardSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={iconBoxSx}>
              <TaskAltIcon />
            </Box>

            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Pending Tasks
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {pendingTasks}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={simpleCardSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={iconBoxSx}>
              <TaskAltIcon />
            </Box>

            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                In Progress
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {inProgressTasks}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={simpleCardSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={iconBoxSx}>
              <TaskAltIcon />
            </Box>

            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Completed
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {completedTasks}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
              Recent Assigned Tasks
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Your latest assigned tasks across all projects.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate("/dashboard/tasks")}
            sx={{
              textTransform: "none",
              borderRadius: 2.5,
              px: 2.5,
              py: 1,
              fontWeight: 700,
            }}
          >
            View All Tasks
          </Button>
        </Box>

        {recentTasks.length === 0 && (
          <Box
            sx={{
              p: 3,
              borderRadius: 2.5,
              bgcolor: "#f9fafb",
              border: "1px dashed #d1d5db",
            }}
          >
            <Typography color="text.secondary">
              No assigned tasks found.
            </Typography>
          </Box>
        )}

        {recentTasks.map((task) => {
          const workspaceId = findWorkspaceId(task.projectId);

          return (
            <Paper
              key={task.id}
              variant="outlined"
              onClick={() => {
                if (!workspaceId) {
                  alert("Workspace not found for this task");
                  return;
                }

                navigate(
                  `/dashboard/workspaces/${workspaceId}/projects/${task.projectId}/tasks/${task.id}`
                );
              }}
              sx={{
                p: 2,
                borderRadius: 2.5,
                mb: 1.5,
                cursor: "pointer",
                borderColor: "#e5e7eb",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#f9fafb",
                  borderColor: "rgba(25, 118, 210, 0.35)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: {
                    xs: "flex-start",
                    sm: "center",
                  },
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                    {task.title}
                  </Typography>

                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    {task.description || "No description provided"}
                  </Typography>
                </Box>

                <Chip
                  label={formatStatus(task.taskStatus)}
                  color={getStatusColor(task.taskStatus)}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
            </Paper>
          );
        })}
      </Paper>
    </Box>
  );
}