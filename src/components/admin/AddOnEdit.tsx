import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { Movie as MovieIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon, Image as ImageIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { AddOnInterface, ApiHelper, ExternalVideoInterface, FileInterface } from "@/helpers";
import { FileUpload } from "./FileUpload";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), { loading: () => <div>Loading image editor...</div> });

interface Props {
  addOn: AddOnInterface;
  updatedCallback: (addOn: AddOnInterface) => void;
}

export function AddOnEdit(props: Props) {
  const [addOn, setAddOn] = useState<AddOnInterface>(null);
  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [externalVideo, setExternalVideo] = useState<ExternalVideoInterface>(null);
  const [pendingFileSave, setPendingFileSave] = useState(false);

  const handleCancel = () => props.updatedCallback(addOn);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    let reloadContent = false;
    e.preventDefault();
    const a = { ...addOn };
    const val = e.target.value;
    switch (e.target.name) {
      case "category":
        a.category = val;
        break;
      case "name":
        a.name = val;
        break;
      case "image":
        a.image = val;
        break;
      case "addOnType":
        a.addOnType = val;
        reloadContent = true;
        break;
    }
    console.log(a);
    setAddOn(a);
    if (reloadContent) loadContent(a);
  };

  const handleExternalVideoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    const ex = { ...externalVideo };
    const val = e.target.value;
    switch (e.target.name) {
      case "videoId":
        ex.videoId = val;
        break;
    }
    setExternalVideo(ex);
  };

  const handleImageUpdated = (dataUrl: string) => {
    const a = { ...addOn };
    a.image = dataUrl;
    setAddOn(a);
    setShowImageEditor(false);
  };

  const validate = () => {
    const errors = [];
    if (addOn.name === "") errors.push("Please enter a name.");
    if (addOn.addOnType === "externalVideo") if (!externalVideo.videoId) errors.push("Please enter a video id.");

    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/addOns", [addOn], "LessonsApi").then((data: AddOnInterface[]) => {
        setAddOn(data[0]);
        console.log("Add-on type", addOn.addOnType);
        if (addOn.addOnType === "file") {
          console.log("Setting Pending file save", pendingFileSave);
          setPendingFileSave(true);
        } else {
          const ev = { ...externalVideo };
          ev.contentType = "addOn";
          ev.contentId = data[0].id;
          ev.name = data[0].name;
          ApiHelper.post("/externalVideos", [ev], "LessonsApi").then(() => {
            props.updatedCallback(data[0]);
          });
        }
      });
    }
  };

  const getFileFields = () => (
    <FileUpload
      key="fileUpload"
      contentType="addOn"
      contentId={props.addOn.id}
      fileId={addOn?.fileId}
      pendingSave={pendingFileSave}
      saveCallback={handleFileSaved}
      resourceId={""}
    />
  );

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this add-on?")) ApiHelper.delete("/addOns/" + addOn.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  };

  useEffect(() => {
    setAddOn(props.addOn);
    loadContent(props.addOn);
  }, [props.addOn]);

  const getImageEditor = () => {
    if (showImageEditor) {
      return (
        <ImageEditor
          updatedFunction={handleImageUpdated}
          imageUrl={addOn.image}
          onCancel={() => setShowImageEditor(false)}
        />
      );
    }
  };

  const getExternalVideoFields = () => {
    if (!externalVideo) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      );
    } else {
      return (
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Provider</InputLabel>
            <Select
              fullWidth
              label="Provider"
              name="provider"
              aria-label="provider"
              value={externalVideo.videoProvider}
              onChange={handleChange}>
              <MenuItem value="Vimeo">Vimeo</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Video Id"
            name="videoId"
            value={externalVideo.videoId}
            onChange={handleExternalVideoChange}
            onKeyDown={handleKeyDown}
            placeholder="abc123"
          />
          <FormControl fullWidth>
            <InputLabel>Looping Video</InputLabel>
            <Select
              label="Looping Video"
              name="loopVideo"
              value={externalVideo.loopVideo?.toString()}
              onChange={handleChange}>
              <MenuItem value="false">No</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      );
    }
  };

  const getTypeFields = () => {
    switch (addOn.addOnType) {
      case "file":
        return getFileFields();
      default:
        return getExternalVideoFields();
    }
  };

  const loadContent = async (a: AddOnInterface) => {
    if (a.addOnType === "file") {
    } else {
      const data = await ApiHelper.get("/externalVideos/content/addOn/" + a.id, "LessonsApi");
      if (data.length > 0) setExternalVideo(data[0]);
      else setExternalVideo({ id: "", videoProvider: "Vimeo", videoId: "", loopVideo: false });
    }
  };

  const handleFileSaved = (file: FileInterface) => {
    const a = { ...addOn };
    a.fileId = file.id;
    ApiHelper.post("/addOns", [a], "LessonsApi").then((data: AddOnInterface[]) => {
      setAddOn(data[0]);
      setPendingFileSave(false);
      props.updatedCallback(data[0]);
    });
  };

  if (!addOn) {
    return <></>;
  } else {
    return (
      <>
        {getImageEditor()}
        <Paper
          sx={{
            borderRadius: 2,
            border: "1px solid var(--admin-border)",
            boxShadow: "var(--admin-shadow-sm)",
            overflow: "hidden"
          }}>
          {/* HEADER */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid var(--admin-border)",
              backgroundColor: "var(--c1l7)"
            }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <MovieIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
              <Typography variant="h6" sx={{
                color: "var(--c1d2)",
                fontWeight: 600,
                lineHeight: 1,
                fontSize: "1.25rem"
              }}>
                Edit Add-on
              </Typography>
            </Stack>
          </Box>

          {/* CONTENT */}
          <Box sx={{ p: 3 }}>
            <ErrorMessages errors={errors} />

            <Grid container spacing={3}>
              {/* Left Column - Form Fields */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select label="Category" name="category" value={addOn.category || "slow worship"} onChange={handleChange}>
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

                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={addOn.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Add-on name"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Add-on Type</InputLabel>
                    <Select label="Add-on Type" name="addOnType" value={addOn.addOnType || "file"} onChange={handleChange}>
                      <MenuItem value="externalVideo">External Video</MenuItem>
                      <MenuItem value="file">File</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Type-specific Fields */}
                  <Box sx={{ pt: 2, borderTop: "1px solid var(--admin-border)" }}>
                    {getTypeFields()}
                  </Box>
                </Stack>
              </Grid>

              {/* Right Column - Image */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Add-on Image
                  </Typography>
                  {showImageEditor ? (
                    <Box sx={{ minHeight: 200 }}>
                      <ImageEditor
                        updatedFunction={handleImageUpdated}
                        imageUrl={addOn.image}
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
                      {addOn.image ? (
                        <img
                          src={addOn.image}
                          alt="Add-on"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "160px",
                            objectFit: "cover",
                            borderRadius: "4px"
                          }}
                        />
                      ) : (
                        <Box sx={{ textAlign: "center" }}>
                          <ImageIcon sx={{ fontSize: 48, color: "var(--c1d2)", mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Click to add image
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* FOOTER */}
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
            <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            {addOn.id && (
              <IconButton color="error" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Paper>
      </>
    );
  }
}
