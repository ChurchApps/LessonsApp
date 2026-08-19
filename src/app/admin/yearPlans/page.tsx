"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { Loading, PageHeader } from "@churchapps/apphelper";
import { Wrapper } from "@/components/Wrapper";
import { YearPlanEditor } from "@/components/yearPlan/YearPlanEditor";
import { ApiHelper, Permissions, UserHelper, YearPlanInterface } from "@/helpers";

export default function YearPlansAdmin() {
  const router = useRouter();
  const { isAuthenticated } = ApiHelper;
  const [plans, setPlans] = useState<YearPlanInterface[] | null>(null);
  const [edit, setEdit] = useState<YearPlanInterface | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
    else if (!UserHelper.checkAccess?.(Permissions.lessonsApi.lessons.edit)) router.push("/");
    else loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    const yp = await ApiHelper.get("/yearPlans", "LessonsApi");
    setPlans(yp || []);
  };

  const openPlan = async (id?: string) => {
    if (!id) {
      setEdit({ name: "", slug: "", venuePreference: "", live: true, sort: (plans?.length || 0) + 1, weeks: [] });
      return;
    }
    const full: YearPlanInterface = await ApiHelper.get("/yearPlans/" + id, "LessonsApi");
    setEdit({ ...full, weeks: full.weeks || [] });
  };

  const save = async () => {
    if (!edit) return;
    setSaving(true);
    try {
      await ApiHelper.post("/yearPlans", [edit], "LessonsApi");
      setEdit(null);
      loadData();
    } finally {
      setSaving(false);
    }
  };

  const removePlan = async (id: string) => {
    if (!window.confirm("Delete this year plan?")) return;
    await ApiHelper.delete("/yearPlans/" + id, "LessonsApi");
    if (edit?.id === id) setEdit(null);
    loadData();
  };

  if (!isAuthenticated) return <></>;

  return (
    <Wrapper>
      <PageHeader title="Year Plans" subtitle="Publish a week-by-week schedule for any curriculum in the library" />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
          <Paper sx={{ flex: 1, width: "100%", border: "1px solid var(--admin-border)", borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 2, backgroundColor: "var(--c1l7)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600 }}>Plans</Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={() => openPlan()} sx={{ color: "var(--c1d2)" }} data-testid="year-plan-add">Add</Button>
            </Box>
            <Box sx={{ p: 2 }}>
              {plans === null && <Loading />}
              {plans?.length === 0 && <Typography color="text.secondary">No year plans yet. Add one and pull lessons from any program.</Typography>}
              {plans && plans.length > 0 && (
                <Table size="small">
                  <TableBody>
                    {plans.map(p => (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Button variant="text" onClick={() => openPlan(p.id)} sx={{ textTransform: "none" }} data-testid={`year-plan-open-${p.id}`}>{p.name}</Button>
                        </TableCell>
                        <TableCell>{p.live ? "Published" : "Draft"}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => removePlan(p.id!)} title="Delete" data-testid={`year-plan-delete-${p.id}`}><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Paper>

          {edit && (
            <YearPlanEditor
              plan={edit}
              saving={saving}
              onChange={setEdit}
              onSave={save}
              onCancel={() => setEdit(null)}
            />
          )}
        </Stack>
      </Box>
    </Wrapper>
  );
}
