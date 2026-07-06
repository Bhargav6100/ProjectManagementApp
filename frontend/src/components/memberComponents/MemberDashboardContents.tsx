import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";

import GroupsIcon from "@mui/icons-material/Groups";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useUsers } from "../../context/UsersContext";
import { useWorkspaces } from "../../context/WorkspaceContext";
import { useProjects } from "../../context/ProjectContext";
import { useTasks } from "../../context/TaskContext";

export default function MemberDashboardContents(): React.JSX.Element {
  const navigate = useNavigate();

  const { users } = useUsers();

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

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Member Dashboard
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
            <GroupsIcon color="primary" />

            <Box>
              <Typography color="text.secondary">Members</Typography>
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
                {workspaces.length}
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
                {allProjects.length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          onClick={() => navigate("/dashboard/my-tasks")}
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
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Pending Tasks</Typography>

          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {pendingTasks}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">In Progress</Typography>

          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {inProgressTasks}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">Completed</Typography>

          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {completedTasks}
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Recent Assigned Tasks
          </Typography>

          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate("/dashboard/tasks")}
            sx={{ textTransform: "none" }}
          >
            View All Tasks
          </Button>
        </Box>

        {recentTasks.length === 0 && (
          <Typography color="text.secondary">
            No assigned tasks found.
          </Typography>
        )}

        {recentTasks.map((task) => (
          <Paper
            key={task.id}
            variant="outlined"
            onClick={() =>
              navigate(
                `/dashboard/projects/${task.projectId}/tasks/${task.id}`
              )
            }
            sx={{
              p: 2,
              borderRadius: 2,
              mb: 1.5,
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#f9fafb",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{task.title}</Typography>

                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                  {task.description || "No description provided"}
                </Typography>
              </Box>

              <Chip
                label={formatStatus(task.taskStatus)}
                color={getStatusColor(task.taskStatus)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Paper>
        ))}
      </Paper>
    </Box>
  );
}