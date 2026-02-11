import React from "react";
import { Chip, ChipProps } from "@mui/material";

type StatusType = "published" | "draft" | "scheduled" | "archived" | "active" | "pending" | "staff" | "featured";

export interface StatusChipProps extends Omit<ChipProps, "color"> {
  status: StatusType;
}

const statusConfig: Record<StatusType, { label: string; color: string; backgroundColor: string }> = {
  published: {
    label: "Published",
    color: "#2e7d32",
    backgroundColor: "#e8f5e9"
  },
  active: {
    label: "Active",
    color: "#2e7d32",
    backgroundColor: "#e8f5e9"
  },
  draft: {
    label: "Draft",
    color: "#f57c00",
    backgroundColor: "#fff3e0"
  },
  pending: {
    label: "Pending",
    color: "#f57c00",
    backgroundColor: "#fff3e0"
  },
  scheduled: {
    label: "Scheduled",
    color: "#1565c0",
    backgroundColor: "#e3f2fd"
  },
  staff: {
    label: "Staff",
    color: "#1565c0",
    backgroundColor: "#e3f2fd"
  },
  featured: {
    label: "Featured",
    color: "#1565c0",
    backgroundColor: "#e3f2fd"
  },
  archived: {
    label: "Archived",
    color: "#757575",
    backgroundColor: "#f5f5f5"
  }
};

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = "small", ...props }) => {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        color: config.color,
        backgroundColor: config.backgroundColor,
        fontWeight: 500,
        fontSize: size === "small" ? "0.75rem" : "0.875rem",
        height: size === "small" ? 24 : 32,
        "& .MuiChip-label": { px: size === "small" ? 1 : 1.5 },
        border: "none"
      }}
      {...props}
    />
  );
};
