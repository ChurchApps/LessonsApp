import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { Movie as MovieIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon, Image as ImageIcon } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { AddOnInterface, ApiHelper, ExternalVideoInterface, FileInterface } from "@/helpers";
import { FileUpload } from "./FileUpload";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), { loading: () => <div>Loading image editor...</div> });

interface Props { addOn: AddOnInterface; updatedCallback: (addOn: AddOnInterface) => void; }

type AnyRecord = Record<string, any>;

export function AddOnEdit(props: Props) {
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [externalVideo, setExternalVideo] = useState<ExternalVideoInterface>(null);
  const [pendingFileSave, setPendingFileSave] = useState(false);
  const [pendingValues, setPendingValues] = useState<AnyRecord | null>(null);

  const { register, handleSubmit, reset, control, watch, setValue, formState } = useForm<AnyRecord>({ defaultValues: { category: "slow worship", name: "", addOnType: "file", image: "" } });
  const e = formState.errors as any;
  const addOnType = watch("addOnType");
  const image = watch("image");
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);
  if (e.videoId?.message) summaryErrors.push(e.videoId.message);

  const handleCancel = () => props.updatedCallback(props.addOn);

  const handleImageUpdated = (dataUrl: string) => {
    setValue("image", dataUrl);
    setShowImageEditor(false);
  };

  const onValid = (values: AnyRecord) => {
    if (values.addOnType === "externalVideo" && !externalVideo?.videoId) return;
    const a: AddOnInterface = { ...props.addOn, category: values.category, name: values.name, addOnType: values.addOnType, image: values.image };
    setPendingValues(values);
    ApiHelper.post("/addOns", [a], "LessonsApi").then((data: AddOnInterface[]) => {
      if (values.addOnType === "file") {
        setPendingFileSave(true);
        setPendingValues({ ...values, savedAddOn: data[0] });
      } else {
        const ev = { ...externalVideo, contentType: "addOn", contentId: data[0].id, name: data[0].name };
        ApiHelper.post("/externalVideos", [ev], "LessonsApi").then(() => props.updatedCallback(data[0]));
      }
    });
  };

  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this add-on?")) ApiHelper.delete("/addOns/" + props.addOn.id.toString(), "LessonsApi").then(() => props.updatedCallback(null)); };

  const handleImageClick = (ev: React.MouseEvent) => { ev.preventDefault(); setShowImageEditor(true); };

  const handleFileSaved = (file: FileInterface) => {
    const saved = pendingValues?.savedAddOn as AddOnInterface;
    const a = { ...saved, fileId: file.id };
    ApiHelper.post("/addOns", [a], "LessonsApi").then((data: AddOnInterface[]) => {
      setPendingFileSave(false);
      setPendingValues(null);
      props.updatedCallback(data[0]);
    });
  };

  const loadContent = async (a: AddOnInterface) => {
    if (a.addOnType !== "file") {
      const data = await ApiHelper.get("/externalVideos/content/addOn/" + a.id, "LessonsApi");
      if (data.length > 0) setExternalVideo(data[0]);
      else setExternalVideo({ id: "", videoProvider: "Vimeo", videoId: "", loopVideo: false });
    }
  };

  useEffect(() => {
    if (props.addOn) {
      reset({ category: props.addOn.category || "slow worship", name: props.addOn.name || "", addOnType: props.addOn.addOnType || "file", image: props.addOn.image || "" });
      loadContent(props.addOn);
    }
  }, [props.addOn, reset]);

  const handleExternalVideoChange = (name: string, value: string) => {
    setExternalVideo((prev) => ({ ...prev, [name]: name === "loopVideo" ? value === "true" : value } as ExternalVideoInterface));
  };

  const getExternalVideoFields = () => {
    if (!externalVideo) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }
    return (
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Provider</InputLabel>
          <Select fullWidth label="Provider" name="provider" aria-label="provider" value={externalVideo.videoProvider} onChange={(ev) => handleExternalVideoChange("videoProvider", ev.target.value as string)}>
            <MenuItem value="Vimeo">Vimeo</MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth label="Video Id" name="videoId" value={externalVideo.videoId} onChange={(ev) => handleExternalVideoChange("videoId", ev.target.value)} placeholder="abc123" />
        <FormControl fullWidth>
          <InputLabel>Looping Video</InputLabel>
          <Select label="Looping Video" name="loopVideo" value={externalVideo.loopVideo?.toString()} onChange={(ev) => handleExternalVideoChange("loopVideo", ev.target.value as string)}>
            <MenuItem value="false">No</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    );
  };

  const getFileFields = () => (
    <FileUpload key="fileUpload" contentType="addOn" contentId={props.addOn.id} fileId={props.addOn?.fileId} pendingSave={pendingFileSave} saveCallback={handleFileSaved} resourceId={""} />
  );

  const getTypeFields = () => addOnType === "file" ? getFileFields() : getExternalVideoFields();

  const getImageEditor = () => {
    if (showImageEditor) {
      return <ImageEditor updatedFunction={handleImageUpdated} imageUrl={image} onCancel={() => setShowImageEditor(false)} />;
    }
  };

  if (!props.addOn) return <></>;
  return (
    <>
      {getImageEditor()}
      <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <MovieIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
            <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>Edit Add-on</Typography>
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        <MenuItem value="slow worship">Slow Worship</MenuItem>
                        <MenuItem value="slow worship with actions">Slow Worship with Actions</MenuItem>
                        <MenuItem value="fast worship">Fast Worship</MenuItem>
                        <MenuItem value="fast worship with actions">Fast Worship with Actions</MenuItem>
                        <MenuItem value="scripture song">Scripture Song</MenuItem>
                        <MenuItem value="scripture song with actions">Scripture Song with Actions</MenuItem>
                        <MenuItem value="game">Game</MenuItem>
                        <MenuItem value="christmas">Christmas</MenuItem>
                        <MenuItem value="easter">Easter</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                <TextField fullWidth label="Name" placeholder="Add-on name" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a name." })} />

                <Controller
                  control={control}
                  name="addOnType"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Add-on Type</InputLabel>
                      <Select {...field} label="Add-on Type">
                        <MenuItem value="externalVideo">External Video</MenuItem>
                        <MenuItem value="file">File</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                <Box sx={{ pt: 2, borderTop: "1px solid var(--admin-border)" }}>
                  {getTypeFields()}
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Add-on Image</Typography>
                {showImageEditor ? (
                  <Box sx={{ minHeight: 200 }}>
                    <ImageEditor updatedFunction={handleImageUpdated} imageUrl={image} onCancel={() => setShowImageEditor(false)} />
                  </Box>
                ) : (
                  <Paper variant="outlined" sx={{ p: 2, textAlign: "center", cursor: "pointer", backgroundColor: "var(--admin-bg-light)", "&:hover": { backgroundColor: "var(--admin-bg)" }, minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={handleImageClick}>
                    {image ? (
                      <img src={image} alt="Add-on" style={{ maxWidth: "100%", maxHeight: "160px", objectFit: "cover", borderRadius: "4px" }} />
                    ) : (
                      <Box sx={{ textAlign: "center" }}>
                        <ImageIcon sx={{ fontSize: 48, color: "var(--c1d2)", mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">Click to add image</Typography>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
          <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit(onValid)}>Save</Button>
          <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>Cancel</Button>
          {props.addOn?.id && (
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Paper>
    </>
  );
}
