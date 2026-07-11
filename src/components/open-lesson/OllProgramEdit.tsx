import { useEffect } from "react";
import { Alert, Box, Button, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Delete as DeleteIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { MarkdownEditor } from "@churchapps/apphelper/markdown";
import { FeedProgramInterface } from "@/helpers";

interface Props { program: FeedProgramInterface; updatedCallback: (program: FeedProgramInterface | null, cancelled: boolean) => void; }

type AnyRecord = Record<string, any>;

export function OllProgramEdit(props: Props) {
  const { register, handleSubmit, reset, control, formState } = useForm<AnyRecord>({ defaultValues: { id: "", name: "", image: "", description: "" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.id?.message) summaryErrors.push(e.id.message);
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(null, true);

  const onValid = (values: AnyRecord) => {
    props.updatedCallback({ ...props.program, id: values.id, name: values.name, image: values.image, description: values.description }, false);
  };

  const handleDelete = () => { if (window.confirm("Are you sure you wish to delete this program?")) props.updatedCallback(null, false); };

  useEffect(() => {
    if (props.program) reset({ id: props.program.id ?? "", name: props.program.name ?? "", image: props.program.image ?? "", description: props.program.description ?? "" });
  }, [props.program, reset]);

  if (!props.program) return <></>;
  return (
    <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EditIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>
            {props.program.id ? "Edit Program" : "Create Program"}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}
        <Stack spacing={3}>
          <TextField fullWidth label="Id" required error={!!e.id} helperText={e.id?.message} {...register("id", { required: "Please enter an id." })} />
          <TextField fullWidth label="Name" required error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a name." })} />
          <TextField fullWidth label="Image" {...register("image")} />
          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, mb: 1, color: "var(--text-secondary)" }}>Description</Typography>
            <Controller
              control={control}
              name="description"
              render={({ field }) => <MarkdownEditor value={field.value || ""} onChange={(v: string) => field.onChange(v)} />}
            />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
        <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit(onValid)} sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" } }}>Save</Button>
        <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel} sx={{ color: "var(--c1d2)", borderColor: "var(--c1d2)" }}>Cancel</Button>
        {props.program.id && (
          <IconButton color="error" onClick={handleDelete} sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
