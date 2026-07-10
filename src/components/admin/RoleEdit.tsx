import { useEffect } from "react";
import { Alert, Box, Button, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { Person as PersonIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { ApiHelper, RoleInterface } from "@/helpers";

interface Props { role: RoleInterface; updatedCallback: (role: RoleInterface | null, created: boolean) => void; }

type AnyRecord = Record<string, any>;

export function RoleEdit(props: Props) {
  const { register, handleSubmit, reset, formState } = useForm<AnyRecord>({ defaultValues: { name: "", sort: "" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.role, false);

  const onValid = (values: AnyRecord) => {
    const r: RoleInterface = { ...props.role, name: values.name, sort: parseInt(values.sort) || 0 };
    ApiHelper.post("/roles", [r], "LessonsApi").then((data: RoleInterface[]) => props.updatedCallback(data[0], !props.role.id));
  };

  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this role?")) ApiHelper.delete("/roles/" + props.role.id!.toString(), "LessonsApi").then(() => props.updatedCallback(null, false)); };

  useEffect(() => {
    if (props.role) reset({ name: props.role.name ?? "", sort: props.role.sort ?? "" });
  }, [props.role, reset]);

  return (
    <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PersonIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>
            {props.role?.id ? "Edit Role" : "Create Role"}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}

        <Stack spacing={3}>
          <TextField fullWidth label="Order" type="number" placeholder="1" helperText="Display order for this role within the section" {...register("sort")} />
          <TextField fullWidth label="Role Name" placeholder="Leader" required error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a role name." })} />
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
        <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit(onValid)}>Save</Button>
        <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>Cancel</Button>
        {props.role?.id && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
