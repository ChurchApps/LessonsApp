import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Box, Card, CardActions, CardContent, CardMedia, Skeleton, Stack, Typography } from "@mui/material";
import { StatusChip } from "./StatusChip";

export interface ContentCardProps {
  title: string;
  thumbnail?: string;
  status?: "published" | "draft" | "scheduled" | "archived";
  lastModified?: Date;
  actions?: React.ReactNode[];
  onClick?: () => void;
  loading?: boolean;
  subtitle?: string;
  description?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  thumbnail,
  status,
  lastModified,
  actions = [],
  onClick,
  loading = false,
  subtitle,
  description
}) => {
  if (loading) {
    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          border: "1px solid var(--admin-border)",
          boxShadow: "var(--admin-shadow-sm)"
        }}>
        <Skeleton variant="rectangular" height={160} />
        <CardContent sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" height={28} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </CardContent>
        <CardActions>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </CardActions>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        border: "1px solid var(--admin-border)",
        boxShadow: "var(--admin-shadow-sm)",
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.2s ease, transform 0.1s ease",
        "&:hover": {
          boxShadow: onClick ? "var(--admin-shadow-md)" : "var(--admin-shadow-sm)",
          transform: onClick ? "translateY(-1px)" : "none"
        }
      }}
      onClick={onClick}>
      {thumbnail && (
        <CardMedia
          component="img"
          height="160"
          image={thumbnail}
          alt={title}
          sx={{
            objectFit: "cover",
            backgroundColor: "#f5f5f5"
          }}
        />
      )}

      <CardContent sx={{ flex: 1, p: 2 }}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              lineHeight: 1.3,
              mb: 0.5,
              color: "rgba(0,0,0,0.87)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(0,0,0,0.6)",
                fontSize: "0.875rem",
                mb: 0.5
              }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {description && (
          <Typography
            variant="body2"
            sx={{
              color: "rgba(0,0,0,0.6)",
              fontSize: "0.875rem",
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.4
            }}>
            {description}
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          {status && <StatusChip status={status} />}

          {lastModified && (
            <Typography
              variant="caption"
              sx={{
                color: "rgba(0,0,0,0.6)",
                fontSize: "0.75rem"
              }}>
              {formatDistanceToNow(lastModified, { addSuffix: true })}
            </Typography>
          )}
        </Stack>
      </CardContent>

      {actions.length > 0 && (
        <CardActions
          sx={{
            px: 2,
            pb: 2,
            pt: 0,
            justifyContent: "flex-end"
          }}>
          {actions.map((action, index) => (
            <Box key={index}>{action}</Box>
          ))}
        </CardActions>
      )}
    </Card>
  );
};
