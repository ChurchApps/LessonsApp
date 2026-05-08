import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Cancel as CancelIcon, Delete as DeleteIcon, Image as ImageIcon, Save as SaveIcon, School as SchoolIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ApiHelper, ProgramInterface } from "@/helpers";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), { loading: () => <div>Loading image editor...</div> });

interface Props { program: ProgramInterface; updatedCallback: (program: ProgramInterface) => void; onClose?: () => void; }

type AnyRecord = Record<string, any>;

export function ProgramEdit(props: Props) {
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);

  const { register, handleSubmit, reset, control, watch, setValue, formState } = useForm<AnyRecord>({ defaultValues: { name: "", slug: "", shortDescription: "", description: "", aboutSection: "", videoEmbedUrl: "", live: "false", image: "" } });
  const e = formState.errors as any;
  const image = watch("image");
  const slug = watch("slug");
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.program);

  const handleImageUpdated = (dataUrl: string) => {
    setValue("image", dataUrl);
    setShowImageEditor(false);
  };

  const onValid = (values: AnyRecord) => {
    const p: ProgramInterface = {
      ...props.program,
      name: values.name,
      slug: values.slug,
      shortDescription: values.shortDescription,
      description: values.description,
      aboutSection: values.aboutSection,
      videoEmbedUrl: values.videoEmbedUrl,
      live: values.live === "true",
      image: values.image
    };
    ApiHelper.post("/programs", [p], "LessonsApi").then((data: ProgramInterface[]) => props.updatedCallback(data[0]));
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you wish to permanently delete this program?")) return;
    props.onClose?.();
    ApiHelper.delete("/programs/" + props.program.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  const handleImageClick = (ev: React.MouseEvent) => { ev.preventDefault(); setShowImageEditor(true); };

  useEffect(() => {
    if (props.program) {
      reset({
        name: props.program.name || "",
        slug: props.program.slug || "",
        shortDescription: props.program.shortDescription || "",
        description: props.program.description || "",
        aboutSection: props.program.aboutSection || "",
        videoEmbedUrl: props.program.videoEmbedUrl || "",
        live: props.program.live ? "true" : "false",
        image: props.program.image || ""
      });
    }
  }, [props.program, reset]);

  if (!props.program) return <></>;

  return (
    <>
      <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SchoolIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
            <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>{props.program.id ? "Edit Program" : "Add Program"}</Typography>
          </Stack>
          {props.program.id && (
            <Button component={Link} href={`/admin/categories/${props.program.id}`} size="small" startIcon={<SettingsIcon />} variant="outlined" sx={{ color: "var(--c1d2)", borderColor: "var(--c1d2)", "&:hover": { borderColor: "var(--c1d1)", backgroundColor: "rgba(21, 101, 192, 0.1)" } }}>Edit Categories</Button>
          )}
        </Box>

        <Box sx={{ p: 3 }}>
          {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Program Image</Typography>
              {showImageEditor ? (
                <Box sx={{ minHeight: 200 }}>
                  <ImageEditor updatedFunction={handleImageUpdated} imageUrl={image} onCancel={() => setShowImageEditor(false)} />
                </Box>
              ) : (
                <Paper variant="outlined" sx={{ p: 2, textAlign: "center", cursor: "pointer", backgroundColor: "var(--admin-bg-light)", "&:hover": { backgroundColor: "var(--admin-bg)" }, minHeight: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={handleImageClick}>
                  {image ? (
                    <img src={image} alt="Program" style={{ maxWidth: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "4px" }} />
                  ) : (
                    <>
                      <ImageIcon sx={{ fontSize: "3rem", color: "var(--text-secondary)", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">Click to add image</Typography>
                    </>
                  )}
                </Paper>
              )}
            </Box>

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

            <TextField fullWidth label="Program Name" placeholder="Children's Ministry" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a program name." })} />
            <TextField fullWidth label="URL Slug" placeholder="childrens-ministry" {...register("slug")} />

            {slug && (
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: "var(--admin-bg-light)" }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Program URL</Typography>
                <Typography variant="body2" component="a" href={`https://lessons.church/${slug}/`} target="_blank" rel="noopener noreferrer" sx={{ color: "var(--c1)", textDecoration: "none", fontFamily: "monospace", "&:hover": { textDecoration: "underline" } }}>
                  https://lessons.church/{slug}/
                </Typography>
              </Paper>
            )}

            <TextField fullWidth label="One-Line Description" placeholder="A brief description for listings" {...register("shortDescription")} />
            <TextField fullWidth multiline rows={3} label="Description" {...register("description")} />
            <TextField fullWidth multiline rows={3} label="About Section" helperText="This appears on the program's main page" {...register("aboutSection")} />
            <TextField fullWidth label="Video Embed URL" placeholder="https://www.youtube.com/embed/..." {...register("videoEmbedUrl")} />
          </Stack>
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button size="small" startIcon={<SaveIcon />} onClick={handleSubmit(onValid)} variant="contained" sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" } }}>Save</Button>
          <Button size="small" startIcon={<CancelIcon />} onClick={handleCancel} variant="outlined" sx={{ color: "var(--c1d2)", borderColor: "var(--c1d2)" }}>Cancel</Button>
          {props.program.id && (
            <IconButton size="small" onClick={handleDelete} sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }} title="Delete program">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Paper>
    </>
  );
}
