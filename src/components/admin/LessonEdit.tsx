import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Book as BookIcon, Cancel as CancelIcon, Delete as DeleteIcon, Edit as EditIcon, Image as ImageIcon, Save as SaveIcon } from "@mui/icons-material";
import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { SlugHelper } from "@churchapps/apphelper";
import { Controller, useForm } from "react-hook-form";
import { ApiHelper, LessonInterface, ProgramInterface, StudyInterface } from "@/helpers";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), { loading: () => <div>Loading image editor...</div> });

interface Props { lesson: LessonInterface; updatedCallback: (lesson: LessonInterface | null) => void; onClose?: () => void; }

type AnyRecord = Record<string, any>;

const LessonEdit = React.memo((props: Props) => {
  const [study, setStudy] = useState<StudyInterface>({});
  const [program, setProgram] = useState<ProgramInterface>({});
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>();
  const [slugCheckError, setSlugCheckError] = useState(false);

  const { register, handleSubmit, reset, control, watch, setValue, formState } = useForm<AnyRecord>({ defaultValues: { name: "", title: "", slug: "", description: "", videoEmbedUrl: "", live: "false", sort: "", image: "" } });
  const e = formState.errors as any;
  const image = watch("image");
  const slug = watch("slug");
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);
  if (slugCheckError) summaryErrors.push("Please check Url Slug");

  const handleCancel = () => props.updatedCallback(props.lesson);

  const loadStudy = (studyId: string) => {
    ApiHelper.get("/studies/" + studyId, "LessonsApi").then((s: StudyInterface) => {
      setStudy(s);
      ApiHelper.get("/programs/" + s.programId, "LessonsApi").then((data: ProgramInterface) => setProgram(data));
    });
  };

  const handleImageUpdated = (dataUrl: string) => {
    setValue("image", dataUrl);
    setShowImageEditor(false);
  };

  const onValid = (values: AnyRecord) => {
    if (!checked) { setSlugCheckError(true); return; }
    setSlugCheckError(false);
    const l: LessonInterface = {
      ...props.lesson,
      name: values.name,
      title: values.title,
      slug: values.slug,
      description: values.description,
      videoEmbedUrl: values.videoEmbedUrl,
      live: values.live === "true",
      sort: parseInt(values.sort) || 0,
      image: values.image
    };
    ApiHelper.post("/lessons", [l], "LessonsApi").then((data: LessonInterface[]) => props.updatedCallback(data[0]));
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you wish to permanently delete this lesson?")) return;
    props.onClose?.();
    ApiHelper.delete("/lessons/" + props.lesson.id!.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  const handleImageClick = (ev: React.MouseEvent) => { ev.preventDefault(); setShowImageEditor(true); };
  const handleSlugValidation = () => {
    setValue("slug", SlugHelper.slugifyString(slug, "urlSlug"));
    setChecked(true);
    setSlugCheckError(false);
  };

  useEffect(() => {
    if (props.lesson) {
      reset({
        name: props.lesson.name || "",
        title: props.lesson.title || "",
        slug: props.lesson.slug || "",
        description: props.lesson.description || "",
        videoEmbedUrl: props.lesson.videoEmbedUrl || "",
        live: props.lesson.live ? "true" : "false",
        sort: props.lesson.sort ?? "",
        image: props.lesson.image || ""
      });
      loadStudy(props.lesson.studyId || "");
      if (props.lesson.slug) setChecked(true);
    }
  }, [props.lesson, reset]);

  if (!props.lesson) return <></>;

  return (
    <>
      <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <BookIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
            <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>{props.lesson.id ? "Edit Lesson" : "Add Lesson"}</Typography>
            {study.name && <Typography variant="body2" sx={{ color: "var(--c1d1)", fontStyle: "italic", ml: 1 }}>in {study.name}</Typography>}
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Lesson Image</Typography>
              {showImageEditor ? (
                <Box sx={{ minHeight: 200 }}>
                  <ImageEditor updatedFunction={handleImageUpdated} imageUrl={image} onCancel={() => setShowImageEditor(false)} />
                </Box>
              ) : (
                <Paper variant="outlined" sx={{ p: 2, textAlign: "center", cursor: "pointer", backgroundColor: "var(--admin-bg-light)", "&:hover": { backgroundColor: "var(--admin-bg)" }, minHeight: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={handleImageClick}>
                  {image ? (
                    <img src={image} alt="Lesson" style={{ maxWidth: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "4px" }} />
                  ) : (
                    <>
                      <ImageIcon sx={{ fontSize: "3rem", color: "var(--text-secondary)", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">Click to add image</Typography>
                    </>
                  )}
                </Paper>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                control={control}
                name="live"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Live</InputLabel>
                    <Select {...field} label="Live">
                      <MenuItem value="false">No</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <TextField fullWidth label="Order" type="number" placeholder="1" {...register("sort")} />
            </Box>

            <TextField fullWidth label="Lesson Name" placeholder="Lesson 1" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a lesson name." })} />
            <TextField fullWidth label="Title" placeholder="Jesus Feeds 5,000" {...register("title")} />

            {checked ? (
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: "var(--admin-bg-light)" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">URL Slug</Typography>
                  <IconButton size="small" onClick={() => setChecked(false)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Typography variant="body1" sx={{ fontFamily: "monospace", mb: 1 }}>{slug}</Typography>
                <Typography variant="body2" component="a" href={`https://lessons.church/${program?.slug}/${study?.slug}/${slug}/`} target="_blank" rel="noopener noreferrer" sx={{ color: "var(--c1)", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  https://lessons.church/{program?.slug}/{study?.slug}/{slug}/
                </Typography>
              </Paper>
            ) : (
              <TextField fullWidth label="URL Slug" helperText="Make sure to check before saving" {...register("slug")} InputProps={{ endAdornment: (<Button variant="contained" size="small" onClick={handleSlugValidation}>Check</Button>) }} />
            )}

            <TextField fullWidth multiline rows={3} label="Description" {...register("description")} />
            <TextField fullWidth label="Video Embed URL" placeholder="https://www.youtube.com/embed/..." {...register("videoEmbedUrl")} />
          </Stack>
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button size="small" startIcon={<SaveIcon />} onClick={handleSubmit(onValid)} variant="contained" sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" } }}>Save</Button>
          <Button size="small" startIcon={<CancelIcon />} onClick={handleCancel} variant="outlined" sx={{ color: "var(--c1d2)", borderColor: "var(--c1d2)" }}>Cancel</Button>
          {props.lesson.id && (
            <IconButton size="small" onClick={handleDelete} sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }} title="Delete lesson">
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
