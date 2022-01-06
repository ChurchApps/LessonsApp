import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Container, Accordion, Card } from "react-bootstrap";
import { Layout, DisplayBox, Loading, ProgramEdit, StudyEdit, LessonEdit, VenueList, BundleList } from "@/components";
import { ApiHelper, LessonInterface, ProgramInterface, StudyInterface, ArrayHelper, } from "@/utils";
import { Button } from "react-bootstrap";


export default function Admin() {
  const [programs, setPrograms] = useState<ProgramInterface[]>(null);
  const [studies, setStudies] = useState<StudyInterface[]>(null);
  const [lessons, setLessons] = useState<LessonInterface[]>(null);
  const [editProgram, setEditProgram] = useState<ProgramInterface>(null);
  const [editStudy, setEditStudy] = useState<StudyInterface>(null);
  const [editLesson, setEditLesson] = useState<LessonInterface>(null);
  const [venuesLessonId, setVenuesLessonId] = useState<string>(null);
  const [resourceContentType, setResourceContentType] = useState<string>(null);
  const [resourceContentId, setResourceContentId] = useState<string>(null);
  const [resourceName, setResourceName] = useState<string>(null);
  const router = useRouter();
  const { isAuthenticated } = ApiHelper

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (isAuthenticated) { loadData(); } }, [isAuthenticated]);

  function loadData() {
    ApiHelper.get("/programs", "LessonsApi").then((data: any) => { setPrograms(data); });
    ApiHelper.get("/studies", "LessonsApi").then((data: any) => { setStudies(data); });
    ApiHelper.get("/lessons", "LessonsApi").then((data: any) => { setLessons(data); });
  }

  function clearEdits() {
    setEditProgram(null);
    setEditStudy(null);
    setEditLesson(null);
    setVenuesLessonId(null);
  }

  const handleUpdated = () => {
    loadData();
    setEditProgram(null);
    setEditStudy(null);
    setEditLesson(null);
  };

  function showResources(contentType: string, contentId: string, name: string) {
    setResourceContentType(contentType);
    setResourceContentId(contentId);
    setResourceName(name);
  }

  function getPrograms() {
    const result: JSX.Element[] = [];
    programs.forEach((p) => {

      result.push(

        <Card>
          <Card.Header>
            <span style={{ float: "right" }}>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); showResources("program", p.id, p.name); }} >
                <i className="fas fa-file-alt"></i>
              </a>{" "}
              &nbsp;
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditStudy({ programId: p.id }); }} >
                <i className="fas fa-plus"></i>
              </a>
            </span>
            <Accordion.Toggle as={Card.Header} className="text-decoration-none" eventKey={`p-${p.id}`} >
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditProgram(p); }} >
                <i className="fas fa-graduation-cap"></i> {p.name}
              </a>
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={`p-${p.id}`}>
            <Card.Body>
              <Accordion className="adminAccordion studyAccordion">
                {getStudies(p.id)}
              </Accordion>
            </Card.Body>
          </Accordion.Collapse>
        </Card >


      );
      /*
              <tr className="programRow" key={`p-${p.id}`}>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditProgram(p); }} >
              <i className="fas fa-graduation-cap"></i> {p.name}
            </a>
          </td>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); showResources("program", p.id, p.name); }} >
              <i className="fas fa-file-alt"></i>
            </a>{" "}
            &nbsp;
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditStudy({ programId: p.id }); }} >
              <i className="fas fa-plus"></i>
            </a>
          </td>
        </tr>
      */

    });
    return result;
  }

  function getStudies(programId: string) {
    const result: JSX.Element[] = [];
    if (studies) {
      ArrayHelper.getAll(studies, "programId", programId).forEach((s) => {

        result.push(
          <Card>
            <Card.Header>
              <span style={{ float: "right" }}>
                <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); showResources("study", s.id, s.name); }} >
                  <i className="fas fa-file-alt"></i>
                </a>{" "}
                &nbsp;
                <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditLesson({ studyId: s.id }); }} >
                  <i className="fas fa-plus"></i>
                </a>
              </span>
              <Accordion.Toggle as={Card.Header} className="text-decoration-none" eventKey={`s-${s.id}`} >
                <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditStudy(s); }} >
                  <i className="fas fa-layer-group"></i> {s.name}
                </a>
              </Accordion.Toggle>



            </Card.Header>
            <Accordion.Collapse eventKey={`s-${s.id}`} >
              <Card.Body>
                {getLessons(s.id)}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        );


        /*
                result.push(
                  <tr className="studyRow" key={`s-${s.id}`}>
                    <td>
                      <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditStudy(s); }} >
                        <i className="fas fa-layer-group"></i> {s.name}
                      </a>
                    </td>
                    <td>
                      <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); showResources("study", s.id, s.name); }} >
                        <i className="fas fa-file-alt"></i>
                      </a>{" "}
                      &nbsp;
                      <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditLesson({ studyId: s.id }); }} >
                        <i className="fas fa-plus"></i>
                      </a>
                    </td>
                  </tr>
                );
                getLessons(s.id).forEach((i) => result.push(i));
                */
      });
    }
    return result;
  }

  function getLessons(studyId: string) {
    const result: JSX.Element[] = [];
    if (lessons) {
      ArrayHelper.getAll(lessons, "studyId", studyId).forEach((l) => {
        result.push(
          <div className="lessonDiv">
            <span style={{ float: "right" }}>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); showResources("lesson", l.id, l.name); }} >
                <i className="fas fa-file-alt"></i>
              </a>{" "}
              &nbsp;
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setVenuesLessonId(l.id); }} >
                <i className="fas fa-map-marker"></i>
              </a>
            </span>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditLesson(l); }} >
              <i className="fas fa-book"></i> {l.name}: {l.title}
            </a>
          </div>
        );
      });
    }
    return result;
  }

  function getTable() {
    if (programs === null) return <Loading />;
    else
      return (
        <Accordion className="adminAccordion">
          {getPrograms()}
        </Accordion>

      );
  }

  function getSidebar() {
    const result: JSX.Element[] = [];
    if (editProgram) result.push(<ProgramEdit program={editProgram} updatedCallback={handleUpdated} key="programEdit" />);
    else if (editStudy) result.push(<StudyEdit study={editStudy} updatedCallback={handleUpdated} key="studyEdit" />);
    else if (editLesson) result.push(<LessonEdit lesson={editLesson} updatedCallback={handleUpdated} key="lessonEdit" />);
    else if (venuesLessonId) result.push(<VenueList lessonId={venuesLessonId} key="venueLesson" />);
    else if (resourceContentType && resourceContentId) result.push(<BundleList contentType={resourceContentType} contentId={resourceContentId} key="bundleList" contentDisplayName={resourceName} />);
    return result;
  }

  const getEditContent = (
    <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditProgram({}); }} >
      <i className="fas fa-plus"></i>
    </a>
  );

  return (
    <Layout>
      <Container>
        <h1>Programs</h1>
        <Row>
          <Col lg={8}>
            <div className="scrollingList">
              <DisplayBox headerText="Programs" headerIcon="none" editContent={getEditContent} >
                {getTable()}
              </DisplayBox>
            </div>
          </Col>
          <Col lg={4}>{getSidebar()}</Col>
        </Row>
      </Container>
    </Layout>
  );
}
