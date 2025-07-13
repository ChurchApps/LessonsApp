"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Extension as ExtensionIcon,
  Groups as GroupsIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import { Wrapper } from "@/components/Wrapper";
import { PageHeader } from "@/components/admin";
import { ProviderEdit } from "@/components/portal/ProviderEdit";
import { ApiHelper, ExternalProviderInterface } from "@/helpers";

export default function ThirdParty() {
  const router = useRouter();
  const { isAuthenticated } = ApiHelper;
  const [providers, setProviders] = useState([]);
  const [editProvider, setEditProvider] = useState<ExternalProviderInterface>(null);

  const loadData = () => {
    ApiHelper.get("/externalProviders", "LessonsApi").then((data: any) => {
      setProviders(data);
    });
  };

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
    else loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProviders = () => {
    if (providers.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <ExtensionIcon sx={{ fontSize: 48, color: "var(--c1l2)", mb: 2 }} />
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No external providers configured
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditProvider({})}>
            Add First Provider
          </Button>
        </Box>
      );
    }

    return (
      <Table size="small">
        <TableBody>{getRows()}</TableBody>
      </Table>
    );
  };

  const getRows = () => {
    return providers.map(p => (
      <TableRow
        key={p.id}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)"
          }
        }}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ExtensionIcon sx={{ color: "var(--c1)", fontSize: "1.2rem" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {p.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="right">
          <IconButton
            size="small"
            onClick={() => setEditProvider(p)}
            sx={{
              color: "var(--c1)",
              "&:hover": { backgroundColor: "var(--c1l7)" }
            }}
            title="Edit provider">
            <EditIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Wrapper>
      <Box sx={{ p: 0 }}>
        <PageHeader
          icon={<ExtensionIcon />}
          title="External Lesson Providers"
          subtitle="Integrate third-party content sources"
          actions={
            providers.length > 0
              ? [
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<AddIcon />}
                    onClick={() => setEditProvider({})}>
                    Add Provider
                  </Button>
                ]
              : []
          }
        />

        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "0 0 8px 8px",
            minHeight: "calc(100vh - 200px)"
          }}>
          {/* Edit Panel - appears at top when editing */}
          {editProvider && (
            <Box sx={{ mb: 3 }}>
              <ProviderEdit
                provider={editProvider}
                updatedCallback={() => {
                  setEditProvider(null);
                  loadData();
                }}
              />
            </Box>
          )}
          
          {/* Providers List - Full Width */}
          <Paper
            sx={{
              borderRadius: 2,
              border: "1px solid var(--admin-border)",
              boxShadow: "var(--admin-shadow-sm)",
              overflow: "hidden"
            }}>
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
                <GroupsIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
                <Typography variant="h6" sx={{ 
                  color: "var(--c1d2)", 
                  fontWeight: 600,
                  lineHeight: 1,
                  fontSize: "1.25rem",
                  display: "flex",
                  alignItems: "center"
                }}>
                  Providers
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You can use lessons from other sources that support the{" "}
                <Link
                  href="https://support.churchapps.org/developer/open-lesson-schema.html"
                  target="_blank"
                  sx={{ color: "var(--c1)" }}>
                  Open Lesson Format
                </Link>{" "}
                in the Lessons.church and B1.church apps. Manage those providers here.
              </Typography>
              {getProviders()}
            </Box>
          </Paper>
        </Paper>
      </Box>
    </Wrapper>
  );
}
