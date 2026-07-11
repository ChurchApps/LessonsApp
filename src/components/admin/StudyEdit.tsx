import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Cancel as CancelIcon, Delete as DeleteIcon, Edit as EditIcon, Image as ImageIcon, Layers as LayersIcon, Save as SaveIcon } from "@mui/icons-material";
import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { SlugHelper } from "@churchapps/apphelper";
import { Controller, useForm } from "react-hook-form";
import { ApiHelper, ProgramInterface, StudyInterface } from "@/helpers";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), { loading: () => <div>Loading image editor...</div> });

interface Props { study: StudyInterface; updatedCallback: (study: StudyInterface | null) => void; onClose?: () => void; }

type AnyRecord = Record<string, any>;

export function StudyEdit(props: Props) {
  const [program, setProgram] = useState<ProgramInterface>({});
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>();
  const [slugCheckError, setSlugCheckError] = useState(false);

  const { register, handleSubmit, reset, control, watch, setValue, formState } = useForm<AnyRecord>({ defaultValues: { name: "", slug: "", shortDescription: "", description: "", videoEmbedUrl: "", live: "false", sort: "", image: "" } });
  const e = formState.errors as any;
  const image = watch("image");
  const slug = watch("slug");
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);
  if (slugCheckError) summaryErrors.push("Please check Url Slug");

  const handleCancel = () => props.updatedCallback(props.study);

  const loadProgram = (programId: string) => {
    ApiHelper.get("/programs/" + programId, "LessonsApi").then((data: ProgramInterface) => setProgram(data));
  };

  const handleImageUpdated = (dataUrl: string) => {
    setValue("image", dataUrl);
    setShowImageEditor(false);
  };

  const onValid = (values: AnyRecord) => {
    if (!checked) { setSlugCheckError(true); return; }
    setSlugCheckError(false);
    const s: StudyInterface = {
      ...props.study,
      name: values.name,
      slug: values.slug,
      shortDescription: values.shortDescription,
      description: values.description,
      videoEmbedUrl: values.videoEmbedUrl,
      live: values.live === "true",
      sort: parseInt(values.sort) || 0,
      image: values.image
    };
    ApiHelper.post("/studies", [s], "LessonsApi").then((data: StudyInterface[]) => props.updatedCallback(data[0]));
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you wish to permanently delete this study?")) return;
    props.onClose?.();
    ApiHelper.delete("/studies/" + props.study.id!.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  const handleImageClick = (ev: React.MouseEvent) => { ev.preventDefault(); setShowImageEditor(true); };
  const handleSlugValidation = () => {
    setValue("slug", SlugHelper.slugifyString(slug, "urlSlug"));
    setChecked(true);
    setSlugCheckError(false);
  };

  useEffect(() => {
    if (props.study) {
      reset({
        name: props.study.name || "",
        slug: props.study.slug || "",
        shortDescription: props.study.shortDescription || "",
        description: props.study.description || "",
        videoEmbedUrl: props.study.videoEmbedUrl || "",
        live: props.study.live ? "true" : "false",
        sort: props.study.sort ?? "",
        image: props.study.image || ""
      });
      loadProgram(props.study.programId || "");
      if (props.study.slug) setChecked(true);
    }
  }, [props.study, reset]);

  if (!props.study) return <></>;

  return (
    <>
      <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LayersIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
            <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>{props.study.id ? "Edit Study" : "Add Study"}</Typography>
            {program.name && <Typography variant="body2" sx={{ color: "var(--c1d1)", fontStyle: "italic", ml: 1 }}>in {program.name}</Typography>}
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Study Image</Typography>
              {showImageEditor ? (
                <Box sx={{ minHeight: 200 }}>
                  <ImageEditor updatedFunction={handleImageUpdated} imageUrl={image} onCancel={() => setShowImageEditor(false)} />
                </Box>
              ) : (
                <Paper variant="outlined" sx={{ p: 2, textAlign: "center", cursor: "pointer", backgroundColor: "var(--admin-bg-light)", "&:hover": { backgroundColor: "var(--admin-bg)" }, minHeight: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={handleImageClick}>
                  {image ? (
                    <img src={image} alt="Study" style={{ maxWidth: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "4px" }} />
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

            <TextField fullWidth label="Study Name" placeholder="Foundations of Faith" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a study name." })} />

            {checked ? (
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: "var(--admin-bg-light)" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">URL Slug</Typography>
                  <IconButton size="small" onClick={() => setChecked(false)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Typography variant="body1" sx={{ fontFamily: "monospace", mb: 1 }}>{slug}</Typography>
                <Typography variant="body2" component="a" href={`https://lessons.church/${program?.slug}/${slug}/`} target="_blank" rel="noopener noreferrer" sx={{ color: "var(--c1)", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  https://lessons.church/{program?.slug}/{slug}/
                </Typography>
              </Paper>
            ) : (
              <TextField fullWidth label="URL Slug" helperText="Make sure to check before saving" {...register("slug")} InputProps={{ endAdornment: (<Button variant="contained" size="small" onClick={handleSlugValidation}>Check</Button>) }} />
            )}

            <TextField fullWidth label="One-Line Description" placeholder="A brief description for listings" {...register("shortDescription")} />
            <TextField fullWidth multiline rows={3} label="Description" {...register("description")} />
            <TextField fullWidth label="Video Embed URL" placeholder="https://www.youtube.com/embed/..." {...register("videoEmbedUrl")} />
          </Stack>
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button size="small" startIcon={<SaveIcon />} onClick={handleSubmit(onValid)} variant="contained" sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" } }}>Save</Button>
          <Button size="small" startIcon={<CancelIcon />} onClick={handleCancel} variant="outlined" sx={{ color: "var(--c1d2)", borderColor: "var(--c1d2)" }}>Cancel</Button>
          {props.study?.id && (
            <IconButton size="small" onClick={handleDelete} sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }} title="Delete study">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Paper>
    </>
  );
}
