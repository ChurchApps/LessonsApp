"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Paper, Stack, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CircularProgress } from "@mui/material";
import { Extension as ExtensionIcon, Movie as MovieIcon, Add as AddIcon } from "@mui/icons-material";
import { Wrapper } from "@/components/Wrapper";
import { PageHeader } from "@churchapps/apphelper";
import { AddOnEdit } from "@/components/admin/AddOnEdit";
import { AddOnInterface, ApiHelper, ProviderInterface } from "@/helpers";

export default function Admin() {
  const [providers, setProviders] = useState<ProviderInterface[]>(null);
  const [addOns, setAddOns] = useState<AddOnInterface[]>(null);
  const [editAddOn, setEditAddOn] = useState<AddOnInterface>(null);

  const router = useRouter();
  const { isAuthenticated } = ApiHelper;

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");


  }, []);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  async function loadData() {
    ApiHelper.get("/providers", "LessonsApi").then((data: any) => {
      setProviders(data);
    });
    ApiHelper.get("/addOns", "LessonsApi").then((data: any) => {
      setAddOns(data);
    });
  }

  function clearEdits() {
    setEditAddOn(null);
  }

  const handleUpdated = () => {
    loadData();
    setEditAddOn(null);
  };

  function getAddOnAccordion() {
    if (addOns === null) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      );
    } else return getAddOns();
  }

  function getAddOns() {
    if (addOns.length === 0) {
      return (
        <Box sx={{ textAlign: "center", p: 4, color: "text.secondary" }}>
          <ExtensionIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1">No add-ons found</Typography>
          <Typography variant="body2">Click the "Add New Add-on" button to create your first add-on.</Typography>
        </Box>
      );
    }

    return (
      <List sx={{ p: 0 }}>
        {addOns.map((a, index) => (
          <ListItem
            key={a.id}
            disablePadding
            sx={{ borderBottom: index < addOns.length - 1 ? "1px solid var(--admin-border)" : "none" }}>
            <ListItemButton
              onClick={() => {
                clearEdits();
                setEditAddOn(a);
              }}
              sx={{
                py: 2,
                "&:hover": { backgroundColor: "var(--c1l7)" }
              }}>
              <ListItemIcon>
                <MovieIcon sx={{ color: "var(--c1d2)" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {a.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Category: {a.category}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  const handleAddNew = () => {
    clearEdits();
    setEditAddOn({
      providerId: providers?.length > 0 ? providers[0].id : "",
      addOnType: "externalVideo",
      category: "slow worship"
    });
  };

  return (
    <Wrapper>
      <Box sx={{ p: 0 }}>
        <PageHeader
          icon={<ExtensionIcon />}
          title="Add-ons"
          subtitle="Manage additional content and media resources"
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<AddIcon />}
            onClick={handleAddNew}>
              Add New Add-on
          </Button>
        </PageHeader>

        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "0 0 8px 8px",
            minHeight: "calc(100vh - 200px)"
          }}>
          {editAddOn && (
            <Box sx={{ mb: 3 }}>
              <AddOnEdit addOn={editAddOn} updatedCallback={handleUpdated} />
            </Box>
          )}

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
                backgroundColor: "var(--c1l7)"
              }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <MovieIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
                <Typography variant="h6" sx={{
                  color: "var(--c1d2)",
                  fontWeight: 600,
                  lineHeight: 1,
                  fontSize: "1.25rem",
                  display: "flex",
                  alignItems: "center"
                }}>
                  Add-ons Library
                </Typography>
              </Stack>
            </Box>
            <Box>
              {getAddOnAccordion()}
            </Box>
          </Paper>
        </Paper>
      </Box>
    </Wrapper>
  );
}
