import React from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode[];
  breadcrumb?: BreadcrumbItem[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, subtitle, actions = [], breadcrumb = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background: "var(--c1l2)",
        color: "white",
        borderRadius: 0,
        mb: 0,
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw"
      }}>
      <Box
        sx={{
          maxWidth: "xl",
          mx: "auto",
          p: { xs: 2, md: 3 }
        }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2, md: 3 }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "8px",
                backgroundColor: "rgba(255,255,255,0.2)",
                "& svg": {
                  fontSize: "1.5rem",
                  color: "white"
                }
              }}>
              {icon}
            </Box>

            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                  lineHeight: 1,
                  m: 0,
                  p: 0,
                  color: "white"
                }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    color: "white"
                  }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>

          {actions.length > 0 && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                width: { xs: "100%", md: "auto" },
                flexShrink: 0,
                "& .MuiButton-root": {
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)"
                  }
                }
              }}>
              {actions.map((action, index) => (
                <Box key={index}>{action}</Box>
              ))}
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
