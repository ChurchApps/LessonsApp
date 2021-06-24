import React from "react";
import { DisplayBox, StudyList, ProgramEdit, ProgramInterface, ApiHelper, Loading } from "./components"
import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const ProgramPage = ({ match }: RouteComponentProps<TParams>) => {
  const [program, setProgram] = React.useState<ProgramInterface>(null);
  const [mode, setMode] = React.useState("display");
  const handleEdit = () => setMode("edit");
  const handleUpdated = () => { loadData(); setMode("display") };

  const loadData = () => {
    ApiHelper.getAnonymous("/programs/" + match.params.id, "LessonsApi").then((data: any) => { setProgram(data); });
  };

  React.useEffect(loadData, []);

  const getContent = () => {
    if (!program) return <Loading />
    return (<Row>
      <Col><b>Name:</b> {program.name}</Col>
    </Row>);
  }

  const getProgram = () => {
    if (mode === "edit") return (<ProgramEdit program={program} updatedCallback={handleUpdated} />)
    else {
      return (<DisplayBox headerText={program?.name || "Program"} headerIcon="none" editFunction={handleEdit}>
        {getContent()}
      </DisplayBox>);
    }

  }

  return (<>
    <h1>Program: {program?.name}</h1>
    <Row>
      <Col xl={8}>
        {getProgram()}
        <StudyList programId={match.params.id} />
      </Col>
    </Row>
  </>);
}
