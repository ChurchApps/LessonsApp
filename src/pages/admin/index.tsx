import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DisplayBox, Loading, ProgramEdit, StudyEdit, LessonEdit, VenueList, BundleList } from "@/components";
import { ApiHelper, LessonInterface, ProgramInterface, StudyInterface, ArrayHelper } from "@/utils";
import { Wrapper } from "@/components/Wrapper";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Icon } from "@mui/material";
import { SmallButton } from "@/appBase/components";


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
  const [expandedProgramId, setExpandedProgramId] = useState<string>("");
  const [expandedStudyId, setExpandedStudyId] = useState<string>("");

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
    /*
    setEditProgram({
      id: '',
      providerId: '',
      name: '',
      slug: '',
      image: '',
      shortDescription: '',
      description: '',
      videoEmbedUrl: '',
      live: false,
      aboutSection: ''
    });*/
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
      if (typeof p.id !== 'string') p.id = '';
      if (typeof p.providerId !== 'string') p.providerId = '';
      if (typeof p.name !== 'string') p.name = '';
      if (typeof p.slug !== 'string') p.slug = '';
      if (typeof p.image !== 'string') p.image = '';
      if (typeof p.shortDescription !== 'string') p.shortDescription = '';
      if (typeof p.description !== 'string') p.description = '';
      if (typeof p.videoEmbedUrl !== 'string') p.videoEmbedUrl = '';
      if (typeof p.live !== 'boolean') p.live = false;
      if (typeof p.aboutSection !== 'string') p.aboutSection = '';
      result.push(
        <Accordion expanded={expandedProgramId === p.id} onChange={() => { setExpandedProgramId((expandedProgramId === p.id) ? "" : p.id); }} className="adminAccordion programAccordion">
          <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header" >
            <div style={{ width: "100%", paddingRight: 20 }}>
              <span style={{ float: "right" }}>
                <SmallButton onClick={() => { router.push("/admin/stats/" + p.id) }} icon="show_chart" text="Stats" />
                &nbsp;
                <SmallButton icon="add" text="Study" onClick={() => { clearEdits(); setEditStudy({ programId: p.id }); }} />
                &nbsp;
                <SmallButton icon="file_upload" text="Files" onClick={() => { clearEdits(); showResources("program", p.id, p.name); }} />
              </span>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditProgram(p); }} >
                <Icon>school</Icon> {p.name}
              </a>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {getStudies(p.id)}
          </AccordionDetails>
        </Accordion>)
    });
    return result;
  }

  function getStudies(programId: string) {
    const result: JSX.Element[] = [];
    if (studies) {
      ArrayHelper.getAll(studies, "programId", programId).forEach((s) => {
        result.push(
          <Accordion expanded={expandedStudyId === s.id} onChange={() => { setExpandedStudyId((expandedStudyId === s.id) ? "" : s.id); }} className="adminAccordion studyAccordion" elevation={0}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header" >
              <div style={{ width: "100%", paddingRight: 20 }}>
                <span style={{ float: "right" }}>
                  <SmallButton icon="add" text="Lesson" onClick={() => { clearEdits(); setEditLesson({ studyId: s.id }); }} />
                  &nbsp;
                  <SmallButton icon="file_upload" text="Files" onClick={() => { clearEdits(); showResources("study", s.id, s.name); }} />
                </span>
                <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditStudy(s); }} >
                  <Icon>layers</Icon> {s.name}
                </a>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {getLessons(s.id)}
            </AccordionDetails>
          </Accordion>)
      });
    }
    return result;
  }

  function getLessons(studyId: string) {
    const result: JSX.Element[] = [];
    if (lessons) {
      ArrayHelper.getAll(lessons, "studyId", studyId).forEach((l) => {
        result.push(
          <div className="lessonDiv" key={"l" + l.id}>
            <span style={{ float: "right" }}>
              <SmallButton icon="map_marker" text="Venues" onClick={() => { clearEdits(); setVenuesLessonId(l.id); }} />
              &nbsp;
              <SmallButton icon="file_upload" text="Files" onClick={() => { clearEdits(); showResources("lesson", l.id, l.name); }} />
            </span>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditLesson(l); }} >
              <Icon>book</Icon> {l.name}: {l.title}
            </a>
          </div>
        );
      });
    }
    return result;
  }

  function getAccordion() {
    if (programs === null) return <Loading />;
    else return getPrograms();
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

  const getEditContent = (<SmallButton icon="add" onClick={() => { clearEdits(); }} />);

  return (
    <Wrapper>
      <h1>Programs</h1>

      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox headerText="Programs" headerIcon="school" editContent={getEditContent} >
            {getAccordion()}
          </DisplayBox>
        </Grid>
        <Grid item md={4} xs={12}>{getSidebar()}</Grid>
      </Grid>
    </Wrapper>
  );
}
