import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Book as BookIcon, Cancel as CancelIcon, Delete as DeleteIcon, Edit as EditIcon, Image as ImageIcon, Save as SaveIcon } from "@mui/icons-material";
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { ErrorMessages, SlugHelper } from "@churchapps/apphelper";
import { ApiHelper, LessonInterface, ProgramInterface, StudyInterface } from "@/helpers";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), {
  loading: () => <div>Loading image editor...</div>
});

interface Props {
  lesson: LessonInterface;
  updatedCallback: (lesson: LessonInterface) => void;
}

const LessonEdit = React.memo((props: Props) => {
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const [study, setStudy] = useState<StudyInterface>({});
  const [program, setProgram] = useState<ProgramInterface>({});

  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>();

  const handleCancel = React.useCallback(() => props.updatedCallback(lesson), [props, lesson]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let p = { ...lesson };
    const val = e.target.value;
    switch (e.target.name) {
    case "name":
      p.name = val;
      break;
    case "title":
      p.title = val;
      break;
    case "slug":
      p.slug = val;
      break;
    case "description":
      p.description = val;
      break;
    case "live":
      p.live = val === "true";
      break;
    case "sort":
      p.sort = parseInt(val);
      break;
    case "videoEmbedUrl":
      p.videoEmbedUrl = val;
      break;
    }
    setLesson(p);
  }, [lesson]);

  const loadStudy = (studyId: string) => {
    ApiHelper.get("/studies/" + studyId, "LessonsApi").then((s: StudyInterface) => {
      setStudy(s);
      ApiHelper.get("/programs/" + s.programId, "LessonsApi").then((data: ProgramInterface) => {
        setProgram(data);
      });
    });
  };

  const handleImageUpdated = (dataUrl: string) => {
    const l = { ...lesson };
    l.image = dataUrl;
    setLesson(l);
    setShowImageEditor(false);
  };

  const validate = () => {
    let errors = [];
    if (!lesson.name || lesson.name === "" || null) errors.push("Please enter a lesson name.");
    if (!checked) errors.push("Please check Url Slug");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = React.useCallback(() => {
    if (validate()) {
      ApiHelper.post("/lessons", [lesson], "LessonsApi").then(data => {
        setLesson(data);
        props.updatedCallback(data);
      });
    }
  }, [lesson, props]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  const handleDelete = React.useCallback(() => {
    if (window.confirm("Are you sure you wish to permanently delete this lesson?")) ApiHelper.delete("/lessons/" + lesson.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  }, [lesson, props]);

  const handleImageClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  }, []);

  const handleSlugValidation = () => {
    const l = { ...lesson };
    l.slug = SlugHelper.slugifyString(l.slug, "urlSlug");
    setLesson(l);
    setChecked(true);
  };

  useEffect(() => {
    setLesson(props.lesson);
    loadStudy(props.lesson.studyId);
    if (props.lesson.slug) setChecked(true);
  }, [props.lesson]);

  const getImageEditor = () => {
    if (showImageEditor) {
      return (
        <ImageEditor
          updatedFunction={handleImageUpdated}
          imageUrl={lesson.image}
          onCancel={() => setShowImageEditor(false)}
        />
      );
    }
  };

  if (!lesson) return <></>;

  return (
    <>
      <Paper
        sx={{
          borderRadius: 2,
          border: "1px solid var(--admin-border)",
          boxShadow: "var(--admin-shadow-sm)",
          overflow: "hidden"
        }}>
        {/* Header */}
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
            <BookIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
            <Typography
              variant="h6"
              sx={{
                color: "var(--c1d2)",
                fontWeight: 600,
                lineHeight: 1,
                fontSize: "1.25rem"
              }}>
              {lesson.id ? "Edit Lesson" : "Add Lesson"}
            </Typography>
            {study.name && (
              <Typography
                variant="body2"
                sx={{
                  color: "var(--c1d1)",
                  fontStyle: "italic",
                  ml: 1
                }}>
                in {study.name}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <ErrorMessages errors={errors} />

          <Grid container spacing={3}>
            {/* Left Column - Form Fields */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Live</InputLabel>
                    <Select label="Live" name="live" value={lesson.live?.toString()} onChange={handleChange}>
                      <MenuItem value="false">No</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Order"
                    name="sort"
                    type="number"
                    value={lesson.sort}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="1"
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Lesson Name"
                  name="name"
                  value={lesson.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Lesson 1"
                />

                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={lesson.title}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Jesus Feeds 5,000"
                />

                {/* URL Slug Section */}
                {checked ? (
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, backgroundColor: "var(--admin-bg-light)" }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">URL Slug</Typography>
                      <IconButton size="small" onClick={() => setChecked(false)} color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Typography variant="body1" sx={{ fontFamily: "monospace", mb: 1 }}>{lesson.slug}</Typography>
                    <Typography
                      variant="body2"
                      component="a"
                      href={`https://lessons.church/${program?.slug}/${study?.slug}/${lesson.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "var(--c1)",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" }
                      }}>
                      https://lessons.church/{program?.slug}/{study?.slug}/{lesson.slug}/
                    </Typography>
                  </Paper>
                ) : (
                  <TextField
                    fullWidth
                    label="URL Slug"
                    name="slug"
                    value={lesson.slug}
                    onChange={handleChange}
                    helperText="Make sure to check before saving"
                    InputProps={{
                      endAdornment: (
                        <Button variant="contained" size="small" onClick={handleSlugValidation}>
                          Check
                        </Button>
                      )
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={lesson.description}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />

                <TextField
                  fullWidth
                  label="Video Embed URL"
                  name="videoEmbedUrl"
                  value={lesson.videoEmbedUrl}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </Stack>
            </Grid>

            {/* Right Column - Image */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Lesson Image</Typography>
                {showImageEditor ? (
                  <Box sx={{ minHeight: 200 }}>
                    <ImageEditor
                      updatedFunction={handleImageUpdated}
                      imageUrl={lesson.image}
                      onCancel={() => setShowImageEditor(false)}
                    />
                  </Box>
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: "var(--admin-bg-light)",
                      "&:hover": { backgroundColor: "var(--admin-bg)" },
                      minHeight: 200,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onClick={handleImageClick}>
                    {lesson.image ? (
                      <img
                        src={lesson.image}
                        alt="Lesson"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "180px",
                          objectFit: "cover",
                          borderRadius: "4px"
                        }}
                      />
                    ) : (
                      <>
                        <ImageIcon sx={{ fontSize: "3rem", color: "var(--text-secondary)", mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">Click to add image</Typography>
                      </>
                    )}
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid var(--admin-border)",
            backgroundColor: "var(--admin-bg)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1
          }}>
          <Button
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "var(--c1)",
              "&:hover": { backgroundColor: "var(--c1d1)" }
            }}>
            Save
          </Button>
          <Button
            size="small"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            variant="outlined"
            sx={{
              color: "var(--c1d2)",
              borderColor: "var(--c1d2)"
            }}>
            Cancel
          </Button>
          {lesson.id && (
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                color: "#d32f2f",
                "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" }
              }}
              title="Delete lesson">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Paper>
    </>
  );
});

LessonEdit.displayName = "LessonEdit";

export { LessonEdit };
