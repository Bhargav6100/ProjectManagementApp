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

import { useWorkspaces } from "../../context/WorkspaceContext";

interface SelectWorkspaceDialogProps {
  open: boolean;
  title: string;
  description: string;
  continueLabel: string;
  onClose: () => void;
  onContinue: (workspaceId: number) => void;
}

export default function SelectWorkspaceDialog({
  open,
  title,
  description,
  continueLabel,
  onClose,
  onContinue,
}: SelectWorkspaceDialogProps): React.JSX.Element {
  const { workspaces, fetchWorkspaces, loading } = useWorkspaces();

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");

  useEffect(() => {
    if (open) {
      fetchWorkspaces();
      setSelectedWorkspaceId("");
    }
  }, [open]);

  const handleContinue = (): void => {
    if (!selectedWorkspaceId) {
      alert("Please select a workspace");
      return;
    }

    onContinue(Number(selectedWorkspaceId));
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
          <Typography color="text.secondary">Loading workspaces...</Typography>
        )}

        {!loading && workspaces.length > 0 && (
          <TextField
            select
            fullWidth
            label="Workspace"
            value={selectedWorkspaceId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSelectedWorkspaceId(e.target.value)
            }
          >
            {workspaces.map((workspace) => (
              <MenuItem key={workspace.id} value={String(workspace.id)}>
                {workspace.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        {!loading && workspaces.length === 0 && (
          <Box
            sx={{
              border: "1px dashed #d1d5db",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              No workspaces available
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Create a workspace first before continuing.
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
          disabled={!selectedWorkspaceId}
          sx={{ textTransform: "none" }}
        >
          {continueLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}