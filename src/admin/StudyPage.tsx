import React from "react";
import { DisplayBox, StudyEdit, StudyInterface, ApiHelper, Loading } from "./components"
import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const StudyPage = ({ match }: RouteComponentProps<TParams>) => {
  const [study, setStudy] = React.useState<StudyInterface>(null);
  const [mode, setMode] = React.useState("display");
  const handleEdit = () => setMode("edit");
  const handleUpdated = () => { loadData(); setMode("display") };

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
    if (mode === "edit") return (<StudyEdit study={study} updatedCallback={handleUpdated} />)
    else {
      return (<DisplayBox headerText={study?.name || "Study"} headerIcon="none" editFunction={handleEdit}>
        {getContent()}
      </DisplayBox>);
    }

  }

  //<!--StudyList studyId={match.params.id} -->
  return (<>
    <h1>Study: {study?.name}</h1>
    <Row>
      <Col xl={8}>
        {getStudy()}

      </Col>
    </Row>
  </>);
}
