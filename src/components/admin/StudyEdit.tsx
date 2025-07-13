import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Cancel as CancelIcon, Delete as DeleteIcon, Edit as EditIcon, Image as ImageIcon, Layers as LayersIcon, Save as SaveIcon } from "@mui/icons-material";
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { ErrorMessages, SlugHelper } from "@churchapps/apphelper";
import { ApiHelper, ProgramInterface, StudyInterface } from "@/helpers";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), {
  loading: () => <div>Loading image editor...</div>
});

interface Props {
  study: StudyInterface;
  updatedCallback: (study: StudyInterface) => void;
}

export function StudyEdit(props: Props) {
  const [study, setStudy] = useState<StudyInterface>(null);
  const [program, setProgram] = useState<ProgramInterface>({});
  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>();

  const handleCancel = () => props.updatedCallback(study);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let p = { ...study };
    const val = e.target.value;
    switch (e.target.name) {
      case "name": p.name = val; break;
      case "slug": p.slug = val; break;
      case "shortDescription": p.shortDescription = val; break;
      case "description": p.description = val; break;
      case "videoEmbedUrl": p.videoEmbedUrl = val; break;
      case "live": p.live = val === "true"; break;
      case "sort": p.sort = parseInt(val); break;
    }
    setStudy(p);
  };

  const loadProgram = (programId: string) => {
    ApiHelper.get("/programs/" + programId, "LessonsApi").then((data: ProgramInterface) => {
      setProgram(data);
    });
  };

  const handleImageUpdated = (dataUrl: string) => {
    const s = { ...study };
    s.image = dataUrl;
    setStudy(s);
    setShowImageEditor(false);
  };

  const validate = () => {
    let errors = [];
    if (!study.name || study.name === "" || null) errors.push("Please enter a study name.");
    if (!checked) errors.push("Please check Url Slug");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/studies", [study], "LessonsApi").then(data => {
        setStudy(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this study?"))
      ApiHelper.delete("/studies/" + study.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  };
  const handleSlugValidation = () => {
    const s = { ...study };
    s.slug = SlugHelper.slugifyString(s.slug, "urlSlug");
    setStudy(s);
    setChecked(true);
  };

  useEffect(() => {
    setStudy(props.study);
    loadProgram(props.study.programId);
    if (props.study.slug) setChecked(true);
  }, [props.study]);

  const getImageEditor = () => {
    if (showImageEditor) {
      return (
        <ImageEditor
          updatedFunction={handleImageUpdated}
          imageUrl={study.image}
          onCancel={() => setShowImageEditor(false)}
        />
      );
    }
  };

  if (!study) return <></>;

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
            <LayersIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
            <Typography
              variant="h6"
              sx={{
                color: "var(--c1d2)",
                fontWeight: 600,
                lineHeight: 1,
                fontSize: "1.25rem"
              }}>
              {study.id ? "Edit Study" : "Add Study"}
            </Typography>
            {program.name && (
              <Typography
                variant="body2"
                sx={{
                  color: "var(--c1d1)",
                  fontStyle: "italic",
                  ml: 1
                }}>
                in {program.name}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <ErrorMessages errors={errors} />
          
          <Grid container spacing={3}>
            {/* Left Column - Form Fields */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Live</InputLabel>
                    <Select label="Live" name="live" value={study.live?.toString()} onChange={handleChange}>
                      <MenuItem value="false">No</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Order"
                    type="number"
                    name="sort"
                    value={study.sort}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="1"
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Study Name"
                  name="name"
                  value={study.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Foundations of Faith"
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
                    <Typography variant="body1" sx={{ fontFamily: "monospace", mb: 1 }}>{study.slug}</Typography>
                    <Typography
                      variant="body2"
                      component="a"
                      href={`https://lessons.church/${program?.slug}/${study.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "var(--c1)",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" }
                      }}>
                      https://lessons.church/{program?.slug}/{study.slug}/
                    </Typography>
                  </Paper>
                ) : (
                  <TextField
                    fullWidth
                    label="URL Slug"
                    name="slug"
                    value={study.slug}
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
                  label="One-Line Description"
                  name="shortDescription"
                  value={study.shortDescription}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="A brief description for listings"
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={study.description}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />

                <TextField
                  fullWidth
                  label="Video Embed URL"
                  name="videoEmbedUrl"
                  value={study.videoEmbedUrl}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </Stack>
            </Grid>

            {/* Right Column - Image */}
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Study Image</Typography>
                {showImageEditor ? (
                  <Box sx={{ minHeight: 200 }}>
                    <ImageEditor
                      updatedFunction={handleImageUpdated}
                      imageUrl={study.image}
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
                    {study.image ? (
                      <img
                        src={study.image}
                        alt="Study"
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
          {study.id && (
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                color: "#d32f2f",
                "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" }
              }}
              title="Delete study">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Paper>
    </>
  );
}
