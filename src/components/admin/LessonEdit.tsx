import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), {
  loading: () => <div>Loading image editor...</div>
});
import { InputBox, ErrorMessages, SlugHelper } from "@churchapps/apphelper";
import { ApiHelper, LessonInterface, StudyInterface, ProgramInterface } from "@/helpers";
import { Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  lesson: LessonInterface;
  updatedCallback: (lesson: LessonInterface) => void;
}

export function LessonEdit(props: Props) {
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const [study, setStudy] = useState<StudyInterface>({});
  const [program, setProgram] = useState<ProgramInterface>({});

  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>();

  const handleCancel = () => props.updatedCallback(lesson);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let p = { ...lesson };
    const val = e.target.value;
    switch (e.target.name) {
      case "name": p.name = val; break;
      case "title": p.title = val; break;
      case "slug": p.slug = val; break;
      case "description": p.description = val; break;
      case "live": p.live = val === "true"; break;
      case "sort": p.sort = parseInt(val); break;
      case "videoEmbedUrl": p.videoEmbedUrl = val; break;
    }
    setLesson(p);
  };

  const loadStudy = (studyId: string) => {
    ApiHelper.get("/studies/" + studyId, "LessonsApi").then((s: StudyInterface) => {
      setStudy(s);
      ApiHelper.get("/programs/" + s.programId, "LessonsApi").then((data: ProgramInterface) => { setProgram(data); });
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
    if (!lesson.name || (lesson.name === "" || null)) errors.push("Please enter a lesson name.");
    if (!checked) errors.push("Please check Url Slug")
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/lessons", [lesson], "LessonsApi").then((data) => {
        setLesson(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this lesson?")) {
      ApiHelper.delete("/lessons/" + lesson.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  };

  const handleSlugValidation = () => {
    const l = { ...lesson };
    l.slug = SlugHelper.slugifyString(l.slug, "urlSlug");
    setLesson(l);
    setChecked(true);
  }

  useEffect(() => { setLesson(props.lesson); loadStudy(props.lesson.studyId); if (props.lesson.slug) setChecked(true) }, [props.lesson]);

  const getImageEditor = () => {
    if (showImageEditor)
      return (<ImageEditor updatedFunction={handleImageUpdated} imageUrl={lesson.image} onCancel={() => setShowImageEditor(false)} />);
  };

  if (!lesson) return <></>
  else return (
    <>
      {getImageEditor()}
      <InputBox id="lessonDetailsBox" headerText="Edit Lesson" headerIcon="book" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
        <ErrorMessages errors={errors} />
        <a href="about:blank" className="d-block" onClick={handleImageClick}>
          <img src={lesson.image || "/images/blank.png"} className="profilePic d-block mx-auto img-fluid" id="imgPreview" alt="lesson" />
        </a>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Live</InputLabel>
              <Select label="Live" name="live" value={lesson.live?.toString()} onChange={handleChange}>
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            </FormControl>

          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Order" name="sort" type="number" value={lesson.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
          </Grid>
        </Grid>
        <TextField fullWidth label="Lesson Name" name="name" value={lesson.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Lesson 1" />
        <TextField fullWidth label="Title" name="title" value={lesson.title} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Jesus Feeds 5,000" />
        {checked
          ? (
            <div style={{ paddingTop: "5px", paddingLeft: "4px" }}>
              <Paper elevation={0}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>{lesson.slug}</Typography>
                  <IconButton onClick={() => setChecked(false)} color="primary"><EditIcon /></IconButton>
                </Stack>
              </Paper>
              <div>
                <a href={"https://lessons.church/" + program?.slug + "/" + study?.slug + "/" + lesson.slug + "/"} target="_blank" rel="noopener noreferrer">
                  {"https://lessons.church/" + program?.slug + "/" + study?.slug + "/" + lesson.slug + "/"}
                </a>
              </div>
            </div>
          )
          : (
            <TextField fullWidth label="Url Slug" name="slug" value={lesson.slug} onChange={handleChange} helperText="Make sure to check before saving"
              InputProps={{ endAdornment: <Button variant="contained" color="primary" onClick={handleSlugValidation}>Check</Button> }}
            />
          )}
        <TextField fullWidth multiline label="Description" name="description" value={lesson.description} onChange={handleChange} onKeyDown={handleKeyDown} />
        <TextField fullWidth label="Video Embed Url" name="videoEmbedUrl" value={lesson.videoEmbedUrl} onChange={handleChange} onKeyDown={handleKeyDown} />
      </InputBox>
    </>
  );
}
