import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { ErrorMessages, InputBox, SlugHelper } from "@churchapps/apphelper";
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

  if (!study) {
    return <></>;
  } else {
    return (
      <>
        {getImageEditor()}
        <InputBox
          id="studyDetailsBox"
          headerText="Edit Study"
          headerIcon="layers"
          saveFunction={handleSave}
          cancelFunction={handleCancel}
          deleteFunction={handleDelete}>
          <ErrorMessages errors={errors} />
          <a href="about:blank" className="d-block" onClick={handleImageClick}>
            <img
              src={study.image || "/images/blank.png"}
              className="profilePic d-block mx-auto img-fluid"
              id="imgPreview"
              alt="study"
            />
          </a>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Live</InputLabel>
                <Select label="Live" name="live" value={study.live?.toString()} onChange={handleChange}>
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
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
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Study Name"
            name="name"
            value={study.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          {checked ? (
            <div style={{ paddingTop: "5px", paddingLeft: "4px" }}>
              <Paper elevation={0}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>{study.slug}</Typography>
                  <IconButton onClick={() => setChecked(false)} color="primary">
                    <EditIcon />
                  </IconButton>
                </Stack>
              </Paper>
              <div>
                <a
                  href={"https://lessons.church/" + program?.slug + "/" + study.slug + "/"}
                  target="_blank"
                  rel="noopener noreferrer">
                  {"https://lessons.church/" + program?.slug + "/" + study.slug + "/"}
                </a>
              </div>
            </div>
          ) : (
            <TextField
              fullWidth
              label="Url Slug"
              name="slug"
              value={study.slug}
              onChange={handleChange}
              helperText="Make sure to check before saving"
              InputProps={{
                endAdornment: (
                  <Button variant="contained" color="primary" onClick={handleSlugValidation}>
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
          />
          <TextField
            fullWidth
            multiline
            label="Description"
            name="description"
            value={study.description}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <TextField
            fullWidth
            label="Video Embed Url"
            name="videoEmbedUrl"
            value={study.videoEmbedUrl}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </InputBox>
      </>
    );
  }
}
