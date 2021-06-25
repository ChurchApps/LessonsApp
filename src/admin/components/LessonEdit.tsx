import React from "react";
import { ApiHelper, InputBox, ErrorMessages, LessonInterface, ImageEditor } from ".";
import { Redirect } from "react-router-dom";
import { Row, Col, FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  lesson: LessonInterface,
  updatedCallback: (lesson: LessonInterface) => void
}

export const LessonEdit: React.FC<Props> = (props) => {
  const [lesson, setLesson] = React.useState<LessonInterface>({} as LessonInterface);
  const [errors, setErrors] = React.useState([]);
  const [showImageEditor, setShowImageEditor] = React.useState<boolean>(false);

  const handleCancel = () => props.updatedCallback(lesson);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let p = { ...lesson };
    switch (e.currentTarget.name) {
      case "name": p.name = e.currentTarget.value; break;
    }
    setLesson(p);
  }


  const handleImageUpdated = (dataUrl: string) => {
    const l = { ...lesson };
    l.image = dataUrl;
    setLesson(l);
    setShowImageEditor(false);
  }

  const validate = () => {
    let errors = [];
    if (lesson.name === "") errors.push("Please enter a lesson name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/lessons", [lesson], "LessonsApi").then(data => {
        setLesson(data);
        props.updatedCallback(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this lesson?")) {
      ApiHelper.delete("/lessons/" + lesson.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  }


  React.useEffect(() => { setLesson(props.lesson) }, [props.lesson]);


  const getImageEditor = () => {
    if (showImageEditor) return (<ImageEditor updatedFunction={handleImageUpdated} imageUrl={lesson.image} onCancel={() => setShowImageEditor(false)} />)
  }

  return (<>
    {getImageEditor()}
    <InputBox id="lessonDetailsBox" headerText="Edit Lesson" headerIcon="fas fa-list" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <a href="about:blank" className="d-block" onClick={handleImageClick}>
        <img src={lesson.image || "/images/blank.png"} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="lesson" />
      </a><br />
      <FormGroup>
        <FormLabel>Live</FormLabel>
        <FormControl as="select" name="live" value={lesson.live?.toString()} onChange={handleChange}>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </FormControl>
      </FormGroup>
      <FormGroup>
        <FormLabel>Lesson Name</FormLabel>
        <FormControl type="text" name="name" value={lesson.name} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
    </InputBox>
  </>);
}
