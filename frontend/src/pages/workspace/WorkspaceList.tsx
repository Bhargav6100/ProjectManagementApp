import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import FolderIcon from "@mui/icons-material/Folder";
import GroupsIcon from "@mui/icons-material/Groups";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWorkspaces } from "../../context/WorkspaceContext";

export default function AdminWorkspaces(): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workspaces, loading, deleteWorkspace } = useWorkspaces();

  const [search, setSearch] = useState<string>("");

  const isAdmin = user?.role === "ADMIN";

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((workspace) => {
      const name = workspace.name.toLowerCase();
      const description = workspace.description?.toLowerCase() ?? "";
      const createdBy = workspace.createdBy?.toLowerCase() ?? "";
      const query = search.toLowerCase();

      return (
        name.includes(query) ||
        description.includes(query) ||
        createdBy.includes(query)
      );
    });
  }, [workspaces, search]);

//   const totalProjects = workspaces.reduce(
//     (sum, workspace) => sum + (workspace.projectCount ?? 0),
//     0
//   );

//   const totalMembers = workspaces.reduce(
//     (sum, workspace) => sum + (workspace.memberCount ?? 0),
//     0
//   );

//   const emptyWorkspaces = workspaces.filter(
//     (workspace) => (workspace.projectCount ?? 0) === 0
//   ).length;

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Workspaces
          </Typography>
          <Typography color="text.secondary">
            View and manage all project workspaces.
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddBusinessIcon />}
            onClick={() => navigate("/dashboard/workspaces/create")}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Create Workspace
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar>
              <WorkspacesIcon />
            </Avatar>

            <Box>
              <Typography color="text.secondary">Total Workspaces</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {workspaces.length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar>
              <FolderIcon />
            </Avatar>

            <Box>
              <Typography color="text.secondary">Total Projects</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                0
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar>
              <GroupsIcon />
            </Avatar>

            <Box>
              <Typography color="text.secondary">Total Members</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
               0
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Empty Workspaces</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            0
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Workspace Directory
          </Typography>

          <TextField
            size="small"
            placeholder="Search workspaces..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSearch(e.target.value)
            }
            sx={{ width: 320 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 700 }}>Workspace</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created By</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Members</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Projects</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary">
                      Loading workspaces...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredWorkspaces.map((workspace) => (
                  <TableRow
                    key={workspace.id}
                    onClick={() => navigate(`/dashboard/workspaces/${workspace.id}`)}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {getInitials(workspace.name)}
                        </Avatar>

                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {workspace.name}
                          </Typography>

                          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                            {workspace.description || "No description provided"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>{workspace.createdBy || "N/A"}</TableCell>

                    <TableCell>{0}</TableCell>

                    <TableCell>{0}</TableCell>

                    <TableCell>
                      <Chip
                        label={
                          (0) > 0 ? "Active" : "Empty"
                        }
                        size="small"
                        color={
                          (0) > 0 ? "success" : "default"
                        }
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      {isAdmin ? (
                        <>
                          <Tooltip title="Edit workspace">
                            <IconButton size="small"
                             onClick={(e): void => {
                             e.stopPropagation();
                             navigate(`/dashboard/workspaces/${workspace.id}/edit`);
                             }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete workspace">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e): void => {
                              e.stopPropagation();
                              deleteWorkspace(workspace.id);
                             }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                          View only
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredWorkspaces.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary">
                      No workspaces found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}