import { useEffect, useState } from "react";
import { Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography } from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Delete as DeleteIcon, Cancel as CancelIcon, Add as AddIcon } from "@mui/icons-material";
import { ErrorMessages, MarkdownEditor } from "@churchapps/apphelper";
import { FeedActionInterface, FeedFileInterface } from "@/helpers";
import { OlfFileEdit } from "./OlfFileEdit";

interface Props {
  action: FeedActionInterface;
  updatedCallback: (action: FeedActionInterface, cancelled: boolean) => void;
}

export function OlfActionEdit(props: Props) {
  const [action, setAction] = useState<FeedActionInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);
  const [editFileIndex, setEditFileIndex] = useState(null);

  const handleMarkdownChange = (newValue: string) => {
    let a = { ...action };
    a.content = newValue;
    setAction(a);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let a = { ...action };
    switch (e.target.name) {
    case "actionType":
      a.actionType = e.target.value;
      if (a.actionType === "play" && !a.files) a.files = [];
      break;
    case "role":
      a.role = e.target.value;
      break;
    case "content":
      a.content = e.target.value;
      break;
    }
    setAction(a);
  };

  const validate = () => {
    let errors = [];
    if (action.content === "") errors.push("Please enter content text.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const a = action;
      if (!a.actionType) a.actionType = "say";
      props.updatedCallback(a, false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this action?")) props.updatedCallback(null, false);
  };

  const getContent = () => {
    if (action.actionType !== "play" && action.actionType !== "download") return <MarkdownEditor value={action.content} onChange={handleMarkdownChange} />;
    else return <TextField fullWidth label="Display Name" name="content" value={action.content} onChange={handleChange} />;
  };

  const getFiles = () => {
    if (action.actionType !== "play") return;

    const rows: JSX.Element[] = [];
    action.files?.forEach((f, i) => {
      rows.push(<TableRow key={i}>
        <TableCell colSpan={2}>
          <a
            href="about:blank"
            onClick={e => {
              e.preventDefault();
              setEditFileIndex(i);
            }}>
            {f.name}
          </a>
        </TableCell>
      </TableRow>);
    });

    return (
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Files</Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditFileIndex(-1);
            }}
            sx={{ color: "var(--c1)" }}>
            Add File
          </Button>
        </Stack>
        <Table size="small">
          <TableBody>{rows}</TableBody>
        </Table>
      </Box>
    );
  };

  const handleFileSave = (file: FeedFileInterface, cancelled: boolean) => {
    if (!cancelled) {
      const a = { ...action };
      if (!a.files) a.files = [];
      if (!file && editFileIndex > -1) {
        a.files.splice(editFileIndex, 1);
      } else {
        if (editFileIndex > -1) a.files[editFileIndex] = file;
        else a.files.push(file);
      }
      setAction(a);
    }
    setEditFileIndex(null);
  };

  useEffect(() => {
    setAction(null);
    setTimeout(() => {
      setAction(props.action);
    }, 100);
  }, [props.action]);

  let editFile: FeedFileInterface = null;
  if (editFileIndex !== null) {
    if (editFileIndex === -1) editFile = { name: "", url: "" };
    else if (action.files) editFile = action.files[editFileIndex];
  }

  if (!action) {
    return <></>;
  } else if (editFile) {
    return <OlfFileEdit file={editFile} updatedCallback={handleFileSave} />;
  } else {
    return (
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
            <EditIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
            <Typography
              variant="h6"
              sx={{
                color: "var(--c1d2)",
                fontWeight: 600,
                lineHeight: 1,
                fontSize: "1.25rem"
              }}>
              {props.action.content?.trim() ? "Edit Action" : "Create Action"}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          <ErrorMessages errors={errors} />

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Action Type</InputLabel>
              <Select label="Action Type" name="actionType" value={action.actionType || ""} onChange={handleChange}>
                <MenuItem value="say" key="say">
                  Say
                </MenuItem>
                <MenuItem value="do" key="do">
                  Do
                </MenuItem>
                <MenuItem value="play" key="play">
                  Play
                </MenuItem>
                <MenuItem value="note" key="note">
                  Note
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Role (Optional)"
              name="role"
              value={action.role || ""}
              onChange={handleChange}
            />

            <Box>
              {getContent()}
            </Box>

            {getFiles()}
          </Stack>
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid var(--admin-border)",
            backgroundColor: "var(--admin-bg)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            flexWrap: "wrap"
          }}>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "var(--c1)",
              "&:hover": { backgroundColor: "var(--c1d1)" }
            }}>
            Save
          </Button>
          <Button
            startIcon={<CancelIcon />}
            variant="outlined"
            onClick={handleCancel}
            sx={{
              color: "var(--c1d2)",
              borderColor: "var(--c1d2)"
            }}>
            Cancel
          </Button>
          {props.action.content?.trim() && (
            <IconButton
              color="error"
              onClick={handleDelete}
              sx={{
                color: "#d32f2f",
                "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" }
              }}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Paper>
    );
  }
}
