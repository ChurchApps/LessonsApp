import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

interface FormCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  loading?: boolean;
}

export function FormCard({ icon, title, children, actions, loading }: FormCardProps) {
  return (
    <Paper
      sx={{
        borderRadius: 2,
        border: "1px solid var(--admin-border)",
        boxShadow: "var(--admin-shadow-sm)",
        overflow: "hidden"
      }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid var(--admin-border)",
          backgroundColor: "var(--c1l7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {React.cloneElement(icon as React.ReactElement<any>, {
            sx: { color: "var(--c1d2)", fontSize: "1.5rem" }
          })}
          <Typography
            variant="h6"
            sx={{
              color: "var(--c1d2)",
              fontWeight: 600,
              lineHeight: 1,
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center"
            }}>
            {title}
          </Typography>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        ) : (
          children
        )}
      </Box>

      {/* Footer with actions */}
      {actions && actions.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid var(--admin-border)",
            backgroundColor: "var(--admin-bg)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            flexWrap: "wrap"
          }}>
          {actions}
        </Box>
      )}
    </Paper>
  );
}
