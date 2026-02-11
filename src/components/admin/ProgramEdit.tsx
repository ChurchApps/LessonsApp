import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Cancel as CancelIcon, Delete as DeleteIcon, Image as ImageIcon, Save as SaveIcon, School as SchoolIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, ProgramInterface } from "@/helpers";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), { loading: () => <div>Loading image editor...</div> });

interface Props {
  program: ProgramInterface;
  updatedCallback: (program: ProgramInterface) => void;
}

export function ProgramEdit(props: Props) {
  const [program, setProgram] = useState<ProgramInterface>(null);
  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);

  const handleCancel = () => props.updatedCallback(program);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    const p = { ...program };
    const val = e.target.value;
    switch (e.target.name) {
      case "live":
        p.live = val === "true";
        break;
      case "name":
        p.name = val;
        break;
      case "slug":
        p.slug = val;
        break;
      case "shortDescription":
        p.shortDescription = val;
        break;
      case "description":
        p.description = val;
        break;
      case "aboutSection":
        p.aboutSection = val;
        break;
      case "videoEmbedUrl":
        p.videoEmbedUrl = val;
        break;
    }
    setProgram(p);
  };

  const handleImageUpdated = (dataUrl: string) => {
    const p = { ...program };
    p.image = dataUrl;
    setProgram(p);
    setShowImageEditor(false);
  };

  const validate = () => {
    const errors = [];
    if (program.name === "") errors.push("Please enter a program name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/programs", [program], "LessonsApi").then(data => {
        setProgram(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this program?")) ApiHelper.delete("/programs/" + program.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  };

  useEffect(() => {
    setProgram(props.program);
  }, [props.program]);

  const getImageEditor = () => {
    if (showImageEditor) {
      return (
        <ImageEditor
          updatedFunction={handleImageUpdated}
          imageUrl={program.image}
          onCancel={() => setShowImageEditor(false)}
        />
      );
    }
  };

  if (!program) return <></>;

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
            <SchoolIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
            <Typography
              variant="h6"
              sx={{
                color: "var(--c1d2)",
                fontWeight: 600,
                lineHeight: 1,
                fontSize: "1.25rem"
              }}>
              {program.id ? "Edit Program" : "Add Program"}
            </Typography>
          </Stack>
          {program.id && (
            <Button
              component={Link}
              href={`/admin/categories/${program.id}`}
              size="small"
              startIcon={<SettingsIcon />}
              variant="outlined"
              sx={{
                color: "var(--c1d2)",
                borderColor: "var(--c1d2)",
                "&:hover": {
                  borderColor: "var(--c1d1)",
                  backgroundColor: "rgba(21, 101, 192, 0.1)"
                }
              }}>
              Edit Categories
            </Button>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <ErrorMessages errors={errors} />

          <Grid container spacing={3}>
            {/* Left Column - Form Fields */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Live</InputLabel>
                  <Select label="Live" name="live" value={program.live?.toString()} onChange={handleChange}>
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Program Name"
                  name="name"
                  value={program.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Children's Ministry"
                />

                <TextField
                  fullWidth
                  label="URL Slug"
                  name="slug"
                  value={program.slug}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="childrens-ministry"
                />

                {program.slug && (
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, backgroundColor: "var(--admin-bg-light)" }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Program URL</Typography>
                    <Typography
                      variant="body2"
                      component="a"
                      href={`https://lessons.church/${program.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "var(--c1)",
                        textDecoration: "none",
                        fontFamily: "monospace",
                        "&:hover": { textDecoration: "underline" }
                      }}>
                      https://lessons.church/{program.slug}/
                    </Typography>
                  </Paper>
                )}

                <TextField
                  fullWidth
                  label="One-Line Description"
                  name="shortDescription"
                  value={program.shortDescription}
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
                  value={program.description}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="About Section"
                  name="aboutSection"
                  value={program.aboutSection}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  helperText="This appears on the program's main page"
                />

                <TextField
                  fullWidth
                  label="Video Embed URL"
                  name="videoEmbedUrl"
                  value={program.videoEmbedUrl}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </Stack>
            </Grid>

            {/* Right Column - Image */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Program Image</Typography>
                {showImageEditor ? (
                  <Box sx={{ minHeight: 200 }}>
                    <ImageEditor
                      updatedFunction={handleImageUpdated}
                      imageUrl={program.image}
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
                    {program.image ? (
                      <img
                        src={program.image}
                        alt="Program"
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
          {program.id && (
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                color: "#d32f2f",
                "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" }
              }}
              title="Delete program">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Paper>
    </>
  );
}
