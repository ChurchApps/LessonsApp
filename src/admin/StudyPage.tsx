import React from "react";
import { DisplayBox, StudyEdit, StudyInterface, ApiHelper, Loading, LessonList, ImageEditor } from "./components"
import { Row, Col } from "react-bootstrap"
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const StudyPage = ({ match }: RouteComponentProps<TParams>) => {
  const [study, setStudy] = React.useState<StudyInterface>(null);
  const [mode, setMode] = React.useState("display");
  const handleEdit = () => setMode("edit");
  const handleUpdated = () => { loadData(); setMode("display") };
  const [showImageEditor, setShowImageEditor] = React.useState<boolean>(false);
  const toggleImageEditor = (show: boolean) => { setShowImageEditor(show); }

  const loadData = () => {
    ApiHelper.getAnonymous("/studies/" + match.params.id, "LessonsApi").then((data: any) => { setStudy(data); });
  };

  React.useEffect(loadData, []);

  const getContent = () => {
    if (!study) return <Loading />
    return (<Row>
      <Col><b>Name:</b> {study.name}</Col>
    </Row>);
  }

  const getStudy = () => {
    if (mode === "edit") return (<StudyEdit study={study} updatedCallback={handleUpdated} toggleImageEditor={toggleImageEditor} />)
    else {
      return (<DisplayBox headerText={study?.name || "Study"} headerIcon="none" editFunction={handleEdit}>
        {getContent()}
      </DisplayBox>);
    }
  }

  const handleImageUpdated = (dataUrl: string) => {
    const s = { ...study };
    s.image = dataUrl;
    setStudy(s);
    setShowImageEditor(false);
  }

  const getImageEditor = () => {
    if (showImageEditor) return (<ImageEditor updatedFunction={handleImageUpdated} imageUrl={study.image} onCancel={() => toggleImageEditor(false)} />)
  }

  return (<>
    <h1>Study: {study?.name}</h1>
    <Row>
      <Col xl={8}>
        {getStudy()}
        <LessonList studyId={match.params.id} />
      </Col>
      <Col lg={4}>
        {getImageEditor()}
      </Col>
    </Row>
  </>);
}
