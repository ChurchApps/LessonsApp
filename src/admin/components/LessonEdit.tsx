import React from "react";
import { ApiHelper, InputBox, ErrorMessages, LessonInterface } from ".";
import { Redirect } from "react-router-dom";
import { Row, Col, FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  lesson: LessonInterface,
  updatedCallback: (lesson: LessonInterface) => void,
  toggleImageEditor: (show: boolean) => void,
}

export const LessonEdit: React.FC<Props> = (props) => {
  const [lesson, setLesson] = React.useState<LessonInterface>({} as LessonInterface);
  const [errors, setErrors] = React.useState([]);
  const [redirect, setRedirect] = React.useState("");

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
      ApiHelper.delete("/lessons/" + lesson.id.toString(), "LessonsApi").then(() => setRedirect("/admin"));
    }
  }


  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.toggleImageEditor(true);
  }


  React.useEffect(() => { setLesson(props.lesson) }, [props.lesson]);

  if (redirect !== "") return <Redirect to={redirect} />
  else return (
    <InputBox id="lessonDetailsBox" headerText="Edit Lesson" headerIcon="fas fa-list" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <Row>
        <Col sm={3}>
          <a href="about:blank" className="d-block" onClick={handleImageClick}>
            <img src={lesson.image || "/images/blank.png"} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="lesson" />
          </a>
        </Col>
        <Col sm={9}>
          <FormGroup>
            <FormLabel>Lesson Name</FormLabel>
            <FormControl type="text" name="name" value={lesson.name} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
      </Row>
    </InputBox>
  );
}
