import React from "react";
import { DisplayBox, ApiHelper, Loading, ProgramInterface, StudyInterface, LessonInterface, ProgramEdit, StudyEdit, LessonEdit, VenueList, ArrayHelper, ResourceList } from "./components"
import { Row, Col } from "react-bootstrap";


export const AdminPage = () => {
  const [programs, setPrograms] = React.useState<ProgramInterface[]>(null);
  const [studies, setStudies] = React.useState<StudyInterface[]>(null);
  const [lessons, setLessons] = React.useState<LessonInterface[]>(null);
  const [editProgram, setEditProgram] = React.useState<ProgramInterface>(null);
  const [editStudy, setEditStudy] = React.useState<StudyInterface>(null);
  const [editLesson, setEditLesson] = React.useState<LessonInterface>(null);
  const [venuesLessonId, setVenuesLessonId] = React.useState<string>(null);

  const [resourceContentType, setResourceContentType] = React.useState<string>(null);
  const [resourceContentId, setResourceContentId] = React.useState<string>(null);

  const loadData = () => {
    ApiHelper.get("/programs", "LessonsApi").then((data: any) => { setPrograms(data); });
    ApiHelper.get("/studies", "LessonsApi").then((data: any) => { setStudies(data); });
    ApiHelper.get("/lessons", "LessonsApi").then((data: any) => { setLessons(data); });
  };

  React.useEffect(loadData, []);

  const clearEdits = () => { setEditProgram(null); setEditStudy(null); setEditLesson(null); setVenuesLessonId(null); }
  const handleUpdated = () => { loadData(); setEditProgram(null); setEditStudy(null); setEditLesson(null); };
  const showResources = (contentType: string, contentId: string) => {
    setResourceContentType(contentType);
    setResourceContentId(contentId);
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    programs.forEach(p => {
      result.push(<tr className="programRow">
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditProgram(p) }}><i className="fas fa-graduation-cap"></i> {p.name}</a></td>
        <td>
          <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); showResources("program", p.id) }}><i className="fas fa-file-alt"></i></a> &nbsp;
          <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditStudy({ programId: p.id }) }}><i className="fas fa-plus"></i></a>
        </td>
      </tr>);
      getStudies(p.id).forEach(i => result.push(i));
    });
    return result;
  }

  const getStudies = (programId: string) => {
    const result: JSX.Element[] = [];
    if (studies) {
      ArrayHelper.getAll(studies, "programId", programId).forEach(s => {
        result.push(<tr className="studyRow">
          <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditStudy(s) }}><i className="fas fa-layer-group"></i> {s.name}</a></td>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); showResources("study", s.id) }}><i className="fas fa-file-alt"></i></a> &nbsp;
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditLesson({ studyId: s.id }) }}><i className="fas fa-plus"></i></a>
          </td>
        </tr>);
        getLessons(s.id).forEach(i => result.push(i));
      });
    }
    return result;
  }

  const getLessons = (studyId: string) => {
    const result: JSX.Element[] = [];
    if (lessons) {
      ArrayHelper.getAll(lessons, "studyId", studyId).forEach(l => {
        result.push(<tr className="lessonRow">
          <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditLesson(l) }}><i className="fas fa-book"></i> {l.name}: {l.title}</a></td>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); showResources("lesson", l.id) }}><i className="fas fa-file-alt"></i></a> &nbsp;
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setVenuesLessonId(l.id); }}><i className="fas fa-map-marker"></i></a>
          </td>
        </tr>);
      });
    }
    return result;
  }

  const getTable = () => {
    if (programs === null) return <Loading />
    else return (
      <table className="table table-sm" id="adminTree">
        <tbody>
          {getRows()}
        </tbody>
      </table>
    )
  }

  const getSidebar = () => {
    const result: JSX.Element[] = [];
    if (editProgram) result.push(<ProgramEdit program={editProgram} updatedCallback={handleUpdated} />)
    else if (editStudy) result.push(<StudyEdit study={editStudy} updatedCallback={handleUpdated} />)
    else if (editLesson) result.push(<LessonEdit lesson={editLesson} updatedCallback={handleUpdated} />)
    else if (venuesLessonId) result.push(<VenueList lessonId={venuesLessonId} />)
    else if (resourceContentType && resourceContentId) result.push(<ResourceList contentType={resourceContentType} contentId={resourceContentId} />)
    return result;
  }

  const getEditContent = () => {
    return (<a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditProgram({}) }}><i className="fas fa-plus"></i></a>);
  }

  return (<>
    <h1>Programs</h1>
    <Row>
      <Col lg={8}>
        <div className="scrollingList">
          <DisplayBox headerText="Programs" headerIcon="none" editContent={getEditContent()} >
            {getTable()}
          </DisplayBox>
        </div>
      </Col>
      <Col lg={4}>
        {getSidebar()}
      </Col>
    </Row>

  </>);
}
