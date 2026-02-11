import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Delete as DeleteIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { MarkdownEditor } from "@churchapps/apphelper-markdown";
import { FeedProgramInterface } from "@/helpers";

interface Props {
  program: FeedProgramInterface;
  updatedCallback: (program: FeedProgramInterface, cancelled: boolean) => void;
}

export function OllProgramEdit(props: Props) {
  const [program, setProgram] = useState<FeedProgramInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);

  const handleMarkdownChange = (newValue: string) => {
    const p = { ...program };
    p.description = newValue;
    setProgram(p);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    const p = { ...program };
    switch (e.target.name) {
      case "id":
        p.id = e.target.value;
        break;
      case "name":
        p.name = e.target.value;
        break;
      case "image":
        p.image = e.target.value;
        break;
      case "description":
        p.description = e.target.value;
        break;
    }
    setProgram(p);
  };

  const validate = () => {
    const errors = [];
    if (program.name === "") errors.push("Please enter a name.");
    if (program.id === "") errors.push("Please enter an id.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) props.updatedCallback(program, false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this program?")) props.updatedCallback(null, false);
  };

  useEffect(() => {
    setProgram(props.program);
  }, [props.program]);

  if (!program) {
    return <></>;
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
              {props.program.id ? "Edit Program" : "Create Program"}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          <ErrorMessages errors={errors} />
          <Stack spacing={3}>
            <TextField fullWidth label="Id" name="id" value={program.id || ""} onChange={handleChange} required />
            <TextField fullWidth label="Name" name="name" value={program.name || ""} onChange={handleChange} required />
            <TextField fullWidth label="Image" name="image" value={program.image || ""} onChange={handleChange} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: 13, mb: 1, color: "var(--text-secondary)" }}>
                Description
              </Typography>
              <MarkdownEditor value={program.description || ""} onChange={handleMarkdownChange} />
            </Box>
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
          {props.program.id && (
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
