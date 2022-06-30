import { useState, useEffect } from "react";
import { InputBox, ErrorMessages, ImageEditor } from "../index";
import { ApiHelper, LessonInterface, StudyInterface, ProgramInterface } from "@/utils";
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

type Props = {
  lesson: LessonInterface;
  updatedCallback: (lesson: LessonInterface) => void;
};

export function LessonEdit(props: Props) {
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const [study, setStudy] = useState<StudyInterface>({});
  const [program, setProgram] = useState<ProgramInterface>({});

  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);

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
    if (lesson.name === "") errors.push("Please enter a lesson name.");
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

  useEffect(() => { setLesson(props.lesson); loadStudy(props.lesson.studyId); }, [props.lesson]);

  const getImageEditor = () => {
    if (showImageEditor)
      return (<ImageEditor updatedFunction={handleImageUpdated} imageUrl={lesson.image} onCancel={() => setShowImageEditor(false)} />);
  };

  if (!lesson) return <></>
  else return (
    <>
      {getImageEditor()}
      <InputBox id="lessonDetailsBox" headerText="Edit Lesson" headerIcon="fas fa-book" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete} >
        <ErrorMessages errors={errors} />
        <a href="about:blank" className="d-block" onClick={handleImageClick}>
          <img src={lesson.image || "/images/blank.png"} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="lesson" />
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
        <TextField fullWidth label="Url Slug" name="slug" value={lesson.slug} onChange={handleChange} onKeyDown={handleKeyDown} />
        <div>
          <a href={"https://lessons.church/" + program?.slug + "/" + study?.slug + "/" + lesson.slug + "/"} target="_blank" rel="noopener noreferrer">
            {"https://lessons.church/" + program?.slug + "/" + study?.slug + "/" + lesson.slug + "/"}
          </a>
        </div>
        <TextField fullWidth multiline label="Description" name="description" value={lesson.description} onChange={handleChange} onKeyDown={handleKeyDown} />
        <TextField fullWidth label="Video Embed Url" name="videoEmbedUrl" value={lesson.videoEmbedUrl} onChange={handleChange} onKeyDown={handleKeyDown} />
      </InputBox>
    </>
  );
}
