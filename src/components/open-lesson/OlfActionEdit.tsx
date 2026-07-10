import { useEffect, useState } from "react";
import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Delete as DeleteIcon, Cancel as CancelIcon, Add as AddIcon } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { MarkdownEditor } from "@churchapps/apphelper/markdown";
import { FeedActionInterface, FeedFileInterface } from "@/helpers";
import { OlfFileEdit } from "./OlfFileEdit";

interface Props { action: FeedActionInterface; updatedCallback: (action: FeedActionInterface | null, cancelled: boolean) => void; }

type AnyRecord = Record<string, any>;

export function OlfActionEdit(props: Props) {
  const [files, setFiles] = useState<FeedFileInterface[]>([]);
  const [editFileIndex, setEditFileIndex] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const { register, handleSubmit, reset, control, watch, formState } = useForm<AnyRecord>({ defaultValues: { actionType: "", role: "", content: "" } });
  const e = formState.errors as any;
  const actionType = watch("actionType");
  const summaryErrors: string[] = [];
  if (e.content?.message) summaryErrors.push(e.content.message);

  const handleCancel = () => props.updatedCallback(null, true);

  const onValid = (values: AnyRecord) => {
    const a: FeedActionInterface = {
      ...props.action,
      actionType: values.actionType || "say",
      role: values.role,
      content: values.content,
      files: values.actionType === "play" ? files : props.action?.files
    };
    props.updatedCallback(a, false);
  };

  const handleDelete = () => { if (window.confirm("Are you sure you wish to delete this action?")) props.updatedCallback(null, false); };

  const handleFileSave = (file: FeedFileInterface | null, cancelled: boolean) => {
    if (!cancelled) {
      const next = [...files];
      if (!file && editFileIndex! > -1) next.splice(editFileIndex!, 1);
      else if (editFileIndex! > -1) next[editFileIndex!] = file!;
      else next.push(file!);
      setFiles(next);
    }
    setEditFileIndex(null);
  };

  useEffect(() => {
    setReady(false);
    const timer = setTimeout(() => {
      if (props.action) {
        reset({ actionType: props.action.actionType || "", role: props.action.role || "", content: props.action.content || "" });
        setFiles(props.action.files || []);
        setReady(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [props.action, reset]);

  let editFile: FeedFileInterface | null = null;
  if (editFileIndex !== null) { if (editFileIndex === -1) editFile = { name: "", url: "" }; else editFile = files[editFileIndex]; }

  if (!ready) return <></>;
  if (editFile) return <OlfFileEdit file={editFile} updatedCallback={handleFileSave} />;

  const getContent = () => {
    if (actionType !== "play" && actionType !== "download") {
      return (
        <Controller
          control={control}
          name="content"
          rules={{ required: "Please enter content text." }}
          render={({ field }) => <MarkdownEditor value={field.value} onChange={(v: string) => field.onChange(v)} />}
        />
      );
    }
    return <TextField fullWidth label="Display Name" error={!!e.content} helperText={e.content?.message} {...register("content", { required: "Please enter content text." })} />;
  };

  const getFiles = () => {
    if (actionType !== "play") return;

    const rows: React.JSX.Element[] = [];
    files.forEach((f, i) => {
      if (!f) return;
      rows.push(
        <TableRow key={i}>
          <TableCell colSpan={2}>
            <a href="about:blank" onClick={(ev) => { ev.preventDefault(); setEditFileIndex(i); }}>{f.name}</a>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Files</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setEditFileIndex(-1)} sx={{ color: "var(--c1)" }}>Add File</Button>
        </Stack>
        <Table size="small">
          <TableBody>{rows}</TableBody>
        </Table>
      </Box>
    );
  };

  return (
    <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EditIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>
            {props.action.content?.trim() ? "Edit Action" : "Create Action"}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}

        <Stack spacing={3}>
          <Controller
            control={control}
            name="actionType"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Action Type</InputLabel>
                <Select {...field} label="Action Type">
                  <MenuItem value="say">Say</MenuItem>
                  <MenuItem value="do">Do</MenuItem>
                  <MenuItem value="play">Play</MenuItem>
                  <MenuItem value="note">Note</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <TextField fullWidth label="Role (Optional)" {...register("role")} />

          <Box>{getContent()}</Box>

          {getFiles()}
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
        <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit(onValid)} sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" } }}>Save</Button>
        <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel} sx={{ color: "var(--c1d2)", borderColor: "var(--c1d2)" }}>Cancel</Button>
        {props.action.content?.trim() && (
          <IconButton color="error" onClick={handleDelete} sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
