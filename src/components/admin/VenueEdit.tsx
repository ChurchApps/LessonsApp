import { useEffect } from "react";
import { Alert, Box, Button, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { LocationOn as LocationIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { ApiHelper, VenueInterface } from "@/helpers";

interface Props { venue: VenueInterface; updatedCallback: (venue: VenueInterface) => void; }

type AnyRecord = Record<string, any>;

export function VenueEdit(props: Props) {
  const { register, handleSubmit, reset, formState } = useForm<AnyRecord>({ defaultValues: { name: "", sort: "" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.venue);

  const onValid = (values: AnyRecord) => {
    const v: VenueInterface = { ...props.venue, name: values.name, sort: parseInt(values.sort) || 0 };
    ApiHelper.post("/venues", [v], "LessonsApi").then((data: VenueInterface) => props.updatedCallback(data));
  };

  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this venue?")) ApiHelper.delete("/venues/" + props.venue.id.toString(), "LessonsApi").then(() => props.updatedCallback(null)); };

  useEffect(() => {
    if (props.venue) reset({ name: props.venue.name ?? "", sort: props.venue.sort ?? "" });
  }, [props.venue, reset]);

  return (
    <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>Edit Venue</Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}

        <Stack spacing={3}>
          <TextField fullWidth label="Order" type="number" placeholder="1" helperText="Display order for this venue" {...register("sort")} />
          <TextField fullWidth label="Venue Name" placeholder="Small Group" required error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a venue name." })} />
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
        <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit(onValid)}>Save</Button>
        <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>Cancel</Button>
        {props.venue?.id && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
