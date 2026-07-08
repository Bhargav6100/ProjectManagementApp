import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";

import { useProjects } from "../../context/ProjectContext";

interface SelectProjectDialogProps {
  open: boolean;
  title: string;
  description: string;
  continueLabel: string;
  onClose: () => void;
  onContinue: (workspaceId: number, projectId: number) => void;
}

export default function SelectProjectDialog({
  open,
  title,
  description,
  continueLabel,
  onClose,
  onContinue,
}: SelectProjectDialogProps): React.JSX.Element {
  const { allProjects, fetchAllProjects, loading } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  useEffect(() => {
    if (open) {
      fetchAllProjects();
      setSelectedProjectId("");
    }
  }, [open]);

  const findWorkspaceId = (): number | undefined => {
    const project = allProjects.find(
      (project) => project.id === Number(selectedProjectId)
    );

    return project?.workspaceId;
  };

  const handleContinue = (): void => {
    if (!selectedProjectId) {
      alert("Please select a project");
      return;
    }

    const workspaceId = findWorkspaceId();

    if (!workspaceId) {
      alert("Workspace id is missing for this project");
      return;
    }

    onContinue(workspaceId, Number(selectedProjectId));
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2.5,
          borderBottom: "1px solid #e5e7eb",
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: "#e0e7ff",
              color: "#3730a3",
            }}
          >
            <FolderIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Select a project to continue.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>

        {loading && (
          <Box
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              p: 3,
              bgcolor: "#f9fafb",
            }}
          >
            <Typography color="text.secondary">Loading projects...</Typography>
          </Box>
        )}

        {!loading && allProjects.length > 0 && (
          <TextField
            select
            fullWidth
            label="Project"
            value={selectedProjectId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSelectedProjectId(e.target.value)
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          >
            {allProjects.map((project) => (
              <MenuItem key={project.id} value={String(project.id)}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        {!loading && allProjects.length === 0 && (
          <Box
            sx={{
              border: "1px dashed #d1d5db",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              bgcolor: "#f9fafb",
            }}
          >
            <Avatar
              sx={{
                width: 52,
                height: 52,
                mx: "auto",
                mb: 1.5,
                bgcolor: "#f1f5f9",
                color: "#64748b",
              }}
            >
              <FolderIcon />
            </Avatar>

            <Typography sx={{ fontWeight: 800 }}>
              No projects available
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Create a project first before continuing.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e5e7eb",
          bgcolor: "#ffffff",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
            px: 3,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!selectedProjectId}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
            px: 3,
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
          }}
        >
          {continueLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}