import { useEffect, useState } from "react";
import {
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

import { useProjects} from "../../context/ProjectContext";

interface SelectProjectDialogProps {
  open: boolean;
  title: string;
  description: string;
  continueLabel: string;
  onClose: () => void;
  onContinue: (workspaceId: number,projectId: number) => void;
}

export default function SelectProjectDialog({
  open,
  title,
  description,
  continueLabel,
  onClose,
  onContinue,
}: SelectProjectDialogProps): React.JSX.Element {
  const {allProjects, fetchAllProjects, loading } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  useEffect(() => {
    if (open) {
      fetchAllProjects();
      setSelectedProjectId("");
    }
  }, [open]);

 const findWorkspaceId = (): number | undefined => {
  const project = allProjects.find(
    (project) => project.id===Number(selectedProjectId)
  );

  return project?.workspaceId;
};
  const handleContinue = (): void => { 
    if (!selectedProjectId) {
      alert("Please select a workspace");
      return;
    }

    onContinue(Number(findWorkspaceId()),Number(selectedProjectId));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>

      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>

        {loading && (
          <Typography color="text.secondary">Loading projects...</Typography>
        )}

        {!loading && allProjects.length > 0 && (
          <TextField
            select
            fullWidth
            label="Projects"
            value={selectedProjectId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSelectedProjectId(e.target.value)
            }
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
              borderRadius: 2,
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              No projects available
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Create a project first before continuing.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!selectedProjectId}
          sx={{ textTransform: "none" }}
        >
          {continueLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}