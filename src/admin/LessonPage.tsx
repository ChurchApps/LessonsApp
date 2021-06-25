import React from "react";
import { DisplayBox, LessonEdit, LessonInterface, ApiHelper, Loading, ImageEditor } from "./components"
import { Row, Col } from "react-bootstrap"
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const LessonPage = ({ match }: RouteComponentProps<TParams>) => {
  const [lesson, setLesson] = React.useState<LessonInterface>(null);
  const [mode, setMode] = React.useState("display");
  const handleEdit = () => setMode("edit");
  const handleUpdated = () => { loadData(); setMode("display") };
  const [showImageEditor, setShowImageEditor] = React.useState<boolean>(false);
  const toggleImageEditor = (show: boolean) => { setShowImageEditor(show); }

  const loadData = () => {
    ApiHelper.getAnonymous("/lessons/" + match.params.id, "LessonsApi").then((data: any) => { setLesson(data); });
  };

  React.useEffect(loadData, []);

  const handleImageUpdated = (dataUrl: string) => {
    const l = { ...lesson };
    l.image = dataUrl;
    setLesson(l);
    setShowImageEditor(false);
  }

  const getContent = () => {
    if (!lesson) return <Loading />
    return (<Row>
      <Col sm={3}>
        <img src={lesson.image || "/images/blank.png"} className="img-fluid" alt="lesson photo" />
      </Col>
      <Col><b>Name:</b> {lesson.name}</Col>
    </Row>);
  }

  const getLesson = () => {
    if (mode === "edit") return (<LessonEdit lesson={lesson} updatedCallback={handleUpdated} toggleImageEditor={toggleImageEditor} />)
    else {
      return (<DisplayBox headerText={lesson?.name || "Lesson"} headerIcon="none" editFunction={handleEdit}>
        {getContent()}
      </DisplayBox>);
    }
  }

  const getImageEditor = () => {
    if (showImageEditor) return (<ImageEditor updatedFunction={handleImageUpdated} imageUrl={lesson.image} onCancel={() => toggleImageEditor(false)} />)
  }

  return (<>
    <h1>Lesson: {lesson?.name}</h1>
    <Row>
      <Col xl={8}>
        {getLesson()}

        <p>Venues</p>
      </Col>
      <Col lg={4}>
        {getImageEditor()}
      </Col>
    </Row>
  </>);
}
