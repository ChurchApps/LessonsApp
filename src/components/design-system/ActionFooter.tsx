import React from "react";
import { Cancel as CancelIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";

interface ActionFooterProps {
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  saveText?: string;
  cancelText?: string;
  showDelete?: boolean;
  saving?: boolean;
  deleteConfirmMessage?: string;
  additionalActions?: React.ReactNode[];
}

export function ActionFooter({
  onSave,
  onCancel,
  onDelete,
  saveText = "Save",
  cancelText = "Cancel",
  showDelete = true,
  saving = false,
  deleteConfirmMessage = "Are you sure you wish to permanently delete this item?",
  additionalActions = []
}: ActionFooterProps) {
  const handleDelete = () => {
    if (onDelete && window.confirm(deleteConfirmMessage)) onDelete();
  };

  return (
    <>
      {/* Additional actions first */}
      {additionalActions}

      {/* Standard actions */}
      <Button
        size="small"
        startIcon={<SaveIcon />}
        onClick={onSave}
        variant="contained"
        disabled={saving}
        sx={{
          backgroundColor: "var(--c1)",
          "&:hover": { backgroundColor: "var(--c1d1)" }
        }}>
        {saving ? "Saving..." : saveText}
      </Button>

      <Button
        size="small"
        startIcon={<CancelIcon />}
        onClick={onCancel}
        variant="outlined"
        disabled={saving}
        sx={{
          color: "var(--c1d2)",
          borderColor: "var(--c1d2)"
        }}>
        {cancelText}
      </Button>

      {showDelete && onDelete && (
        <IconButton
          size="small"
          onClick={handleDelete}
          disabled={saving}
          sx={{
            color: "#d32f2f",
            "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" }
          }}
          title="Delete">
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </>
  );
}
