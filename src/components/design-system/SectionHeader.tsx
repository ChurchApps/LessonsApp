import React from "react";
import { Stack, Typography } from "@mui/material";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  actions?: React.ReactNode[];
}

export function SectionHeader({ icon, title, actions }: SectionHeaderProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {React.cloneElement(icon as React.ReactElement, {
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

      {actions && actions.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
