import { useEffect } from "react";
import { Alert, Box, Button, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { List as ListIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { ApiHelper, SectionInterface } from "@/helpers";

interface Props { section: SectionInterface; updatedCallback: (section: SectionInterface | null, created: boolean) => void; }

type AnyRecord = Record<string, any>;

export function SectionEdit(props: Props) {
  const { register, handleSubmit, reset, formState } = useForm<AnyRecord>({ defaultValues: { name: "", materials: "", sort: "" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.section, false);

  const onValid = (values: AnyRecord) => {
    const s: SectionInterface = { ...props.section, name: values.name, materials: values.materials, sort: parseInt(values.sort) || 0 };
    ApiHelper.post("/sections", [s], "LessonsApi").then((data: SectionInterface[]) => props.updatedCallback(data[0], !props.section.id));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this section?")) { ApiHelper.delete("/sections/" + props.section.id!.toString(), "LessonsApi").then(() => props.updatedCallback(null, false)); }
  };

  useEffect(() => {
    if (props.section) reset({ name: props.section.name ?? "", materials: props.section.materials ?? "", sort: props.section.sort ?? "" });
  }, [props.section, reset]);

  return (
    <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ListIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>
            {props.section?.id ? "Edit Section" : "Create Section"}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}

        <Stack spacing={3}>
          <TextField label="Order" fullWidth type="number" placeholder="1" helperText="Display order for this section" {...register("sort")} />
          <TextField label="Section Name" fullWidth placeholder="Section 1" required error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a section name." })} />
          <TextField label="Materials Needed" fullWidth multiline rows={2} placeholder="List any materials needed for this section" {...register("materials")} />
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
        <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit(onValid)}>Save</Button>
        <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>Cancel</Button>
        {props.section?.id && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
