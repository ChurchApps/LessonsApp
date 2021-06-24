import React from "react";
import { DisplayBox, LessonEdit, LessonInterface, ApiHelper, Loading, LessonList } from "./components"
import { Row, Col } from "react-bootstrap"
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const LessonPage = ({ match }: RouteComponentProps<TParams>) => {
  const [lesson, setLesson] = React.useState<LessonInterface>(null);
  const [mode, setMode] = React.useState("display");
  const handleEdit = () => setMode("edit");
  const handleUpdated = () => { loadData(); setMode("display") };

  const loadData = () => {
    ApiHelper.getAnonymous("/lessons/" + match.params.id, "LessonsApi").then((data: any) => { setLesson(data); });
  };

  React.useEffect(loadData, []);

  const getContent = () => {
    if (!lesson) return <Loading />
    return (<Row>
      <Col><b>Name:</b> {lesson.name}</Col>
    </Row>);
  }

  const getLesson = () => {
    if (mode === "edit") return (<LessonEdit lesson={lesson} updatedCallback={handleUpdated} />)
    else {
      return (<DisplayBox headerText={lesson?.name || "Lesson"} headerIcon="none" editFunction={handleEdit}>
        {getContent()}
      </DisplayBox>);
    }

  }

  return (<>
    <h1>Lesson: {lesson?.name}</h1>
    <Row>
      <Col xl={8}>
        {getLesson()}

        <p>Venues</p>
      </Col>
    </Row>
  </>);
}
