import React from "react";
import { DisplayBox, StudyList, ProgramEdit, ProgramInterface, ApiHelper, Loading, ImageEditor } from "./components"
import { Row, Col } from "react-bootstrap"
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const ProgramPage = ({ match }: RouteComponentProps<TParams>) => {
  const [program, setProgram] = React.useState<ProgramInterface>(null);
  const [mode, setMode] = React.useState("display");
  const handleEdit = () => setMode("edit");
  const handleUpdated = () => { loadData(); setMode("display") };
  const [showImageEditor, setShowImageEditor] = React.useState<boolean>(false);
  const toggleImageEditor = (show: boolean) => { setShowImageEditor(show); }

  const loadData = () => {
    ApiHelper.getAnonymous("/programs/" + match.params.id, "LessonsApi").then((data: any) => { setProgram(data); });
  };

  React.useEffect(loadData, []);

  const getContent = () => {
    if (!program) return <Loading />
    return (<Row>
      <Col sm={3}>
        <img src={program.image || "/images/blank.png"} className="img-fluid" id="imgPreview" alt="program" />
      </Col>
      <Col sm={9}><b>Name:</b> {program.name}</Col>
    </Row>);
  }

  const getProgram = () => {
    if (mode === "edit") return (<ProgramEdit program={program} updatedCallback={handleUpdated} toggleImageEditor={toggleImageEditor} />)
    else {
      return (<DisplayBox headerText={program?.name || "Program"} headerIcon="none" editFunction={handleEdit}>
        {getContent()}
      </DisplayBox>);
    }

  }


  const handleImageUpdated = (dataUrl: string) => {
    const p = { ...program };
    p.image = dataUrl;
    setProgram(p);
    setShowImageEditor(false);
  }

  const getImageEditor = () => {
    if (showImageEditor) return (<ImageEditor updatedFunction={handleImageUpdated} imageUrl={program.image} onCancel={() => toggleImageEditor(false)} />)
  }

  return (<>
    <h1>Program: {program?.name}</h1>
    <Row>
      <Col xl={8}>
        {getProgram()}
        <StudyList programId={match.params.id} />
      </Col>
      <Col lg={4}>
        {getImageEditor()}
      </Col>
    </Row>
  </>);
}
