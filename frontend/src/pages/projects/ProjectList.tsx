import { useEffect, useMemo, useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import SelectWorkspaceDialog from "../../components/common/SelectWorkspaceDialog";
import type { ProjectStatus } from "../../utils/ProjectStatus";
import { useAuth } from "../../context/AuthContext";
export default function ProjectList(): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    allProjects,
    fetchAllProjects,
    fetchMyProjects,
    loading,
    deleteProject,
  } = useProjects();
  const [search, setSearch] = useState<string>("");
  const [workspaceDialogOpen, setWorkspaceDialogOpen] =
    useState<boolean>(false);
  const isAdmin = user?.role === "ADMIN";
  const isPM = user?.role === "PROJECT_MANAGER";
  useEffect(() => {
    if (!user) return;
    if (isAdmin) {
      fetchAllProjects();
    } else {
      fetchMyProjects();
    }
  }, [user]);
   const handleDeleteProject = async (
  e: React.MouseEvent<HTMLButtonElement>,
  projectId: number
): Promise<void> => {
  e.stopPropagation();

  const confirmed = window.confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmed) return;

  await deleteProject(projectId);

  if (isAdmin) {
    await fetchAllProjects();
  } else {
    await fetchMyProjects();
  }
};
  const query = search.toLowerCase();
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const name = project.name.toLowerCase();
      const description = project.description?.toLowerCase() ?? "";
      const status = project.status.toLowerCase();
      const createdBy = project.createdBy?.toLowerCase() ?? "";
      return (
        name.includes(query) ||
        description.includes(query) ||
        status.includes(query) ||
        createdBy.includes(query)
      );
    });
  }, [allProjects, query]);
  const activeProjects = allProjects.filter(
    (project) => project.status === "ACTIVE",
  ).length;
  const completeProjects = allProjects.filter(
    (project) => project.status === "COMPLETE",
  ).length;
  const archivedProjects = allProjects.filter(
    (project) => project.status === "ARCHIVED",
  ).length;
  const formatStatus = (status: ProjectStatus): string => {
    if (status === "ACTIVE") {
      return "Active";
    }
    if (status === "COMPLETE") {
      return "Complete";
    }
    return "Archived";
  };
  const getStatusColor = (
    status: ProjectStatus,
  ): "success" | "primary" | "default" => {
    if (status === "ACTIVE") {
      return "success";
    }
    if (status === "COMPLETE") {
      return "primary";
    }
    return "default";
  };
  const getInitials = (name: string): string => {
    return (
      name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase() || "P"
    );
  };
  const summaryCardSx = {
    p: 2.5,
    borderRadius: 3,
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 16px 36px rgba(15, 23, 42, 0.07)",
      borderColor: "rgba(25, 118, 210, 0.25)",
    },
  };
  return (
    <Box>
      
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        
        <Box>
          
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            
            Projects
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 15 }}>
            
            {isAdmin
              ? "View all projects across all workspaces."
              : "View all projects across your assigned workspaces."}
          </Typography>
        </Box>
        {(isAdmin || isPM) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setWorkspaceDialogOpen(true)}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              px: 3,
              py: 1,
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            
            Create Project
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
        
        <Paper sx={summaryCardSx}>
          
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            
            Total Projects
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            
            {allProjects.length}
          </Typography>
        </Paper>
        <Paper sx={summaryCardSx}>
          
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            
            Active Projects
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            
            {activeProjects}
          </Typography>
        </Paper>
        <Paper sx={summaryCardSx}>
          
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            
            Complete Projects
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            
            {completeProjects}
          </Typography>
        </Paper>
        <Paper sx={summaryCardSx}>
          
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            
            Archived Projects
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            
            {archivedProjects}
          </Typography>
        </Paper>
      </Box>
      <Paper
        sx={{
          borderRadius: 3,
          p: 2.5,
          mb: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        
        <TextField
          size="small"
          fullWidth
          placeholder="Search projects by name, description, status, or creator..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setSearch(e.target.value)
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: "#f9fafb" },
            },
          }}
        />
      </Paper>
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          mb: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          
          <Box>
            
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.3 }}>
              
              Project Directory
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              
              {isAdmin
                ? "All projects created inside the system."
                : "Projects assigned to your workspaces."}
            </Typography>
          </Box>
          <Chip
            label={`${filteredProjects.length} projects`}
            color="primary"
            sx={{ fontWeight: 700 }}
          />
        </Box>
        <TableContainer>
          
          <Table>
            
            <TableHead>
              
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  
                  Project
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  
                  Workspace ID
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  
                  Created By
                </TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>
                  
                  Created At
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 800, color: "text.secondary" }}
                >
                  
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {loading && (
                <TableRow>
                  
                  <TableCell colSpan={6} sx={{ py: 4 }}>
                    
                    <Typography color="text.secondary">
                      
                      Loading projects...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                filteredProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    hover
                    onClick={() =>
                      navigate(
                        `/dashboard/workspaces/${project.workspaceId}/projects/${project.id}`,
                      )
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": { bgcolor: "#f9fafb" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    
                    <TableCell sx={{ py: 2 }}>
                      
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        
                        <Avatar
                          sx={{
                            width: 42,
                            height: 42,
                            bgcolor: "primary.main",
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          
                          {getInitials(project.name)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          
                          <Typography sx={{ fontWeight: 700 }}>
                            
                            {project.name}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            sx={{
                              fontSize: 13,
                              maxWidth: 420,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            
                            {project.description ||
                              "No description provided"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      
                      <Typography sx={{ fontSize: 14 }}>
                        
                        {project.workspaceId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      
                      <Chip
                        label={formatStatus(project.status)}
                        color={getStatusColor(project.status)}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      
                      <Typography sx={{ fontSize: 14 }}>
                        
                        {project.createdBy || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      
                      <Typography sx={{ fontSize: 14 }}>
                        
                        {new Date(project.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 0.5,
                        }}
                      >
                        
                        <Tooltip title="View project">
                          
                          <IconButton
                            size="small"
                            onClick={(e): void => {
                              e.stopPropagation();
                              navigate(
                                `/dashboard/workspaces/${project.workspaceId}/projects/${project.id}`,
                              );
                            }}
                            sx={{
                              bgcolor: "#f9fafb",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.08)",
                              },
                            }}
                          >
                            
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {(isAdmin || isPM) && (
                          <Tooltip title="Edit project">
                            <IconButton
                              size="small"
                              onClick={(e): void => {
                                e.stopPropagation();
                                navigate(
                                  `/dashboard/workspaces/${project.workspaceId}/projects/${project.id}/edit`,
                                );
                              }}
                              sx={{
                                bgcolor: "#f9fafb",
                                "&:hover": {
                                  bgcolor: "rgba(25, 118, 210, 0.08)",
                                },
                              }}
                            >
                              
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {(isAdmin || isPM) && (
                          <Tooltip title="Delete project">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e): void =>
                               void handleDeleteProject(e, project.id)
                              }
                              sx={{
                                bgcolor: "#fff5f5",
                                "&:hover": {
                                  bgcolor: "rgba(211, 47, 47, 0.08)",
                                },
                              }}
                            >
                              
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && filteredProjects.length === 0 && (
                <TableRow>
                  
                  <TableCell colSpan={6} sx={{ py: 4 }}>
                    
                    <Typography color="text.secondary">
                      
                      No projects found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <SelectWorkspaceDialog
        open={workspaceDialogOpen}
        title="Create Project"
        description="Choose the workspace where this project should be created."
        continueLabel="Continue"
        onClose={() => setWorkspaceDialogOpen(false)}
        onContinue={(workspaceId: number): void => {
          navigate(`/dashboard/workspaces/${workspaceId}/projects/create`);
        }}
      />
    </Box>
  );
}
