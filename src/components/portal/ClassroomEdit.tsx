import { useEffect, useState } from "react";
import { Cancel as CancelIcon, Delete as DeleteIcon, Save as SaveIcon, School as SchoolIcon } from "@mui/icons-material";
import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { GroupInterface } from "@churchapps/helpers";
import { ApiHelper, ClassroomInterface } from "@/helpers";

interface Props { classroom: ClassroomInterface; updatedCallback: (classroom: ClassroomInterface | null) => void; }

type AnyRecord = Record<string, any>;

export function ClassroomEdit(props: Props) {
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [teams, setTeams] = useState<GroupInterface[]>([]);

  const { register, handleSubmit, reset, control, formState } = useForm<AnyRecord>({ defaultValues: { name: "", upcomingGroupId: "", recentGroupId: "" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.classroom);

  const onValid = (values: AnyRecord) => {
    const c: ClassroomInterface = { ...props.classroom, name: values.name, upcomingGroupId: values.upcomingGroupId || null, recentGroupId: values.recentGroupId || null };
    ApiHelper.post("/classrooms", [c], "LessonsApi").then((data: ClassroomInterface[]) => props.updatedCallback(data[0]));
  };

  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this classroom?")) ApiHelper.delete("/classrooms/" + props.classroom.id!.toString(), "LessonsApi").then(() => props.updatedCallback(null)); };

  const loadData = () => {
    ApiHelper.get("/groups/tag/standard", "MembershipApi").then(data => setGroups(data));
    ApiHelper.get("/groups/tag/team", "MembershipApi").then(data => setTeams(data));
  };

  useEffect(() => {
    if (props.classroom) reset({ name: props.classroom.name ?? "", upcomingGroupId: props.classroom.upcomingGroupId ?? "", recentGroupId: props.classroom.recentGroupId ?? "" });
    loadData();
  }, [props.classroom, reset]);

  return (
    <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SchoolIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem", display: "flex", alignItems: "center" }}>Edit Classroom</Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}
        <Stack spacing={3}>
          <TextField fullWidth label="Classroom Name" placeholder="3rd-5th Grade" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a classroom name." })} />

          <Controller
            control={control}
            name="upcomingGroupId"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Volunteer Team (optional)</InputLabel>
                <Select {...field} label="Volunteer Team (optional)">
                  <MenuItem value="">None</MenuItem>
                  {teams.map(team => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)}
                </Select>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>You can select a volunteer team to have access to upcoming lessons in the B1 app.</Typography>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="recentGroupId"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Parent/Student Group (optional)</InputLabel>
                <Select {...field} label="Parent/Student Group (optional)">
                  <MenuItem value="">None</MenuItem>
                  {groups.map(group => <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>)}
                </Select>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>You can select a group of students and/or parents to have access to recent lessons in the B1 app.</Typography>
              </FormControl>
            )}
          />
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button size="small" startIcon={<SaveIcon />} onClick={handleSubmit(onValid)} variant="contained" sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" } }}>Save</Button>
        <Button size="small" startIcon={<CancelIcon />} onClick={handleCancel} variant="outlined" sx={{ color: "var(--c1d2)", borderColor: "var(--c1d2)" }}>Cancel</Button>
        {props.classroom?.id && (
          <IconButton size="small" onClick={handleDelete} sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }} title="Delete classroom">
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
