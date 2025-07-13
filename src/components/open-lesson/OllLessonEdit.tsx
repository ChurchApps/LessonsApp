import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Delete as DeleteIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { ErrorMessages, MarkdownEditor } from "@churchapps/apphelper";
import { FeedLessonInterface } from "@/helpers";

interface Props {
  lesson: FeedLessonInterface;
  updatedCallback: (lesson: FeedLessonInterface, cancelled: boolean) => void;
}

export function OllLessonEdit(props: Props) {
  const [lesson, setLesson] = useState<FeedLessonInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);

  const handleMarkdownChange = (newValue: string) => {
    let l = { ...lesson };
    l.description = newValue;
    setLesson(l);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let l = { ...lesson };
    switch (e.target.name) {
    case "id":
      l.id = e.target.value;
      break;
    case "name":
      l.name = e.target.value;
      break;
    case "image":
      l.image = e.target.value;
      break;
    case "description":
      l.description = e.target.value;
      break;
    }
    setLesson(l);
  };

  const validate = () => {
    let errors = [];
    if (lesson.name === "") errors.push("Please enter a name.");
    if (lesson.id === "") errors.push("Please enter an id.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) props.updatedCallback(lesson, false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this lesson?")) props.updatedCallback(null, false);
  };

  useEffect(() => {
    setLesson(props.lesson);
  }, [props.lesson]);

  if (!lesson) {
    return <></>;
  } else {
    return (
      <>
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
                {props.lesson.id ? "Edit Lesson" : "Create Lesson"}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: 3 }}>
            <ErrorMessages errors={errors} />
            <Stack spacing={3}>
              <TextField fullWidth label="Id" name="id" value={lesson.id || ""} onChange={handleChange} required />
              <TextField fullWidth label="Name" name="name" value={lesson.name || ""} onChange={handleChange} required />
              <TextField fullWidth label="Image" name="image" value={lesson.image || ""} onChange={handleChange} />
              <Box>
                <Typography variant="body2" sx={{ fontSize: 13, mb: 1, color: "var(--text-secondary)" }}>
                Description
                </Typography>
                <MarkdownEditor value={lesson.description || ""} onChange={handleMarkdownChange} />
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
            {props.lesson.id && (
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
      </>
    );
  }
}
