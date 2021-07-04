import React from "react";
import { ApiHelper, InputBox, ErrorMessages, LessonInterface, ImageEditor } from ".";
import { FormGroup, FormControl, FormLabel, Row, Col } from "react-bootstrap";

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
      case "title": p.title = e.currentTarget.value; break;
      case "description": p.description = e.currentTarget.value; break;
      case "live": p.live = e.currentTarget.value === "true"; break;
      case "sort": p.sort = parseInt(e.currentTarget.value); break;
      case "videoEmbedUrl": p.videoEmbedUrl = e.currentTarget.value; break;
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
    <InputBox id="lessonDetailsBox" headerText="Edit Lesson" headerIcon="fas fa-book" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <a href="about:blank" className="d-block" onClick={handleImageClick}>
        <img src={lesson.image || "/images/blank.png"} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="lesson" />
      </a><br />
      <Row>
        <Col>
          <FormGroup>
            <FormLabel>Live</FormLabel>
            <FormControl as="select" name="live" value={lesson.live?.toString()} onChange={handleChange}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <FormLabel>Order</FormLabel>
            <FormControl type="number" name="sort" value={lesson.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
          </FormGroup>
        </Col>
      </Row>

      <FormGroup>
        <FormLabel>Lesson Name</FormLabel>
        <FormControl type="text" name="name" value={lesson.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Lesson 1" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Title</FormLabel>
        <FormControl type="text" name="title" value={lesson.title} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Jesus Feeds 5,000" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Description</FormLabel>
        <FormControl as="textarea" type="text" name="description" value={lesson.description} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
      <FormGroup>
        <FormLabel>Video Embed Url</FormLabel>
        <FormControl type="text" name="videoEmbedUrl" value={lesson.videoEmbedUrl} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
    </InputBox>
  </>);
}
