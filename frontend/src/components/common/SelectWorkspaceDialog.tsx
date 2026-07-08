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

import WorkspacesIcon from "@mui/icons-material/Workspaces";

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
            <WorkspacesIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Select a workspace to continue.
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
            <Typography color="text.secondary">
              Loading workspaces...
            </Typography>
          </Box>
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
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
              <WorkspacesIcon />
            </Avatar>

            <Typography sx={{ fontWeight: 800 }}>
              No workspaces available
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Create a workspace first before continuing.
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
          disabled={!selectedWorkspaceId}
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