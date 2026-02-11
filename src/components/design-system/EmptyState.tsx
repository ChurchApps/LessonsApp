import React from "react";
import { Add as AddIcon, Inbox as InboxIcon } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  actions?: EmptyStateAction[];
}

export function EmptyState({ icon, title, description, action, actions = [] }: EmptyStateProps) {
  const allActions = action ? [action, ...actions] : actions;
  const defaultIcon = icon || <InboxIcon sx={{ fontSize: "3rem", color: "text.disabled" }} />;

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2
      }}>
      {defaultIcon}

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          fontWeight: 500,
          maxWidth: 400
        }}>
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 500,
            lineHeight: 1.5
          }}>
          {description}
        </Typography>
      )}

      {allActions.length > 0 && (
        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
          {allActions.map((actionItem, index) => (
            <Button
              key={index}
              variant={actionItem.variant || "contained"}
              startIcon={actionItem.icon || <AddIcon />}
              onClick={actionItem.onClick}
              sx={{
                backgroundColor: actionItem.variant === "contained" ? "var(--c1)" : undefined,
                "&:hover":
                  actionItem.variant === "contained"
                    ? { backgroundColor: "var(--c1d1)" }
                    : undefined
              }}>
              {actionItem.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
