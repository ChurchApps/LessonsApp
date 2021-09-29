import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Container, Dropdown } from "react-bootstrap";
import { Layout, DisplayBox, Loading, SectionEdit, RoleEdit, ActionEdit, SectionCopy } from "@/components";
import { VenueInterface, LessonInterface, StudyInterface, SectionInterface, RoleInterface, ActionInterface, ResourceInterface, AssetInterface, ApiHelper, ArrayHelper, CopySectionInterface } from "@/utils";

export default function Venue() {
  const [venue, setVenue] = useState<VenueInterface>(null);
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const [study, setStudy] = useState<StudyInterface>(null);
  const [sections, setSections] = useState<SectionInterface[]>(null);
  const [roles, setRoles] = useState<RoleInterface[]>(null);
  const [actions, setActions] = useState<ActionInterface[]>(null);
  const [copySection, setCopySection] = useState<CopySectionInterface>(null);
  const [editSection, setEditSection] = useState<SectionInterface>(null);
  const [editRole, setEditRole] = useState<RoleInterface>(null);
  const [editAction, setEditAction] = useState<ActionInterface>(null);

  const [lessonResources, setLessonResources] = useState<ResourceInterface[]>(null);
  const [studyResources, setStudyResources] = useState<ResourceInterface[]>(null);
  const [programResources, setProgramResources] = useState<ResourceInterface[]>(null);
  const [allAssets, setAllAssets] = useState<AssetInterface[]>(null);
  const { isAuthenticated } = ApiHelper;
  const router = useRouter();
  const pathId = router.query.id;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, []);
  useEffect(() => { if (isAuthenticated) { loadData(); } }, [pathId, isAuthenticated]);
  useEffect(() => { if (isAuthenticated) { loadResources(); } }, [lesson, study, isAuthenticated]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (isAuthenticated) loadAssets(); }, [lessonResources, studyResources, programResources, isAuthenticated]);

  function loadResources() {
    if (lesson && study) {
      ApiHelper.get("/resources/content/lesson/" + lesson.id, "LessonsApi").then((data: any) => { setLessonResources(data); });
      ApiHelper.get("/resources/content/study/" + study.id, "LessonsApi").then((data: any) => { setStudyResources(data); });
      ApiHelper.get("/resources/content/program/" + study.programId, "LessonsApi").then((data: any) => { setProgramResources(data); });
    }
  }

  function loadAssets() {
    if (allAssets === null) {
      if (lessonResources && studyResources && programResources) {
        const allResources = [].concat(lessonResources).concat(studyResources).concat(programResources);
        if (allResources.length > 0) {
          const resourceIds: string[] = ArrayHelper.getUniqueValues(allResources, "id");
          ApiHelper.get("/assets/resourceIds?resourceIds=" + resourceIds.join(","), "LessonsApi").then((data: any) => { setAllAssets(data); });
        }
      }
    }
  }

  function loadData() {
    ApiHelper.get("/venues/" + pathId, "LessonsApi").then((v: VenueInterface) => {
      setVenue(v);
      ApiHelper.get("/lessons/" + v.lessonId, "LessonsApi").then((data: any) => {
        setLesson(data);
        ApiHelper.get("/studies/" + data.studyId, "LessonsApi").then((d: any) => { setStudy(d); });
      });
      ApiHelper.get("/sections/venue/" + v.id, "LessonsApi").then((data: any) => { setSections(data); });
      ApiHelper.get("/roles/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setRoles(data); });
      ApiHelper.get("/actions/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setActions(data); });
    });
  }

  const clearEdits = () => {
    setEditSection(null);
    setEditRole(null);
    setEditAction(null);
    setCopySection(null);
  };

  const handleUpdated = () => {
    loadData();
    clearEdits();
  };

  const handleSectionUpdated = (section: SectionInterface, created: boolean) => {
    handleUpdated();
    if (created) createRole(section.id);
  };

  const handleRoleUpdated = (role: RoleInterface, created: boolean) => {
    handleUpdated();
    if (created) createAction(role.id);
  };

  const handleActionUpdated = (action: ActionInterface, created: boolean) => {
    handleUpdated();
    if (created) createAction(action.roleId, action.sort + 1);
  };

  const createSection = () => {
    clearEdits();
    setEditSection({
      lessonId: venue.lessonId,
      venueId: venue.id,
      sort: sections.length + 1,
    });
  };

  const duplicateSection = () => {
    clearEdits();
    setCopySection({ sourceLessonId: lesson.id });
  };

  const createRole = (sectionId: string) => {
    const sort = ArrayHelper.getAll(roles, "sectionId", sectionId).length + 1;
    clearEdits();
    setEditRole({ lessonId: venue.lessonId, sectionId: sectionId, sort: sort });
  };

  const createAction = (roleId: string, sort?: number) => {
    if (!sort) sort = ArrayHelper.getAll(actions, "roleId", roleId).length + 1;
    clearEdits();
    setEditAction({ lessonId: venue.lessonId, roleId: roleId, sort: sort });
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    sections.forEach((s) => {
      result.push(<tr className="sectionRow" key={`s-${s.id}`}>
        <td>
          <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditSection(s); }} >
            <i className="fas fa-tasks"></i> {s.name}
          </a>
        </td>
        <td>
          <a href="about:blank" onClick={(e) => { e.preventDefault(); createRole(s.id); }} >
            <i className="fas fa-plus"></i>
          </a>
        </td>
      </tr>);
      getRoles(s.id).forEach((r) => result.push(r));
    });
    return result;
  };

  const getRoles = (sectionId: string) => {
    const result: JSX.Element[] = [];
    if (roles) {
      ArrayHelper.getAll(roles, "sectionId", sectionId).forEach((r) => {
        result.push(<tr className="roleRow" key={`r-${r.id}`}>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditRole(r); }} >
              <i className="fas fa-user-alt"></i> {r.name}
            </a>
          </td>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); createAction(r.id); }} >
              <i className="fas fa-plus"></i>
            </a>
          </td>
        </tr>);
        getActions(r.id).forEach((i) => result.push(i));
      });
    }
    return result;
  };

  const getActions = (roleId: string) => {
    const result: JSX.Element[] = [];
    if (actions) {
      ArrayHelper.getAll(actions, "roleId", roleId).forEach((a: ActionInterface) => {
        result.push(
          <tr className="actionRow" key={`a-${a.id}`}>
            <td colSpan={2}>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditAction(a); }} >
                <i className="fas fa-check"></i> {a.actionType}: {a.content}
              </a>
            </td>
          </tr>
        );
      });
    }
    return result;
  };

  const getTable = () => {
    if (sections === null) return <Loading />;
    else return (<table className="table table-sm" id="adminTree">
      <tbody>{getRows()}</tbody>
    </table>);
  };

  const getSidebar = () => {
    const result: JSX.Element[] = [];
    if (editSection) result.push(<SectionEdit section={editSection} updatedCallback={handleSectionUpdated} key="sectionEdit" />);
    else if (editRole) result.push(<RoleEdit role={editRole} updatedCallback={handleRoleUpdated} />);
    else if (editAction) result.push(<ActionEdit action={editAction} updatedCallback={handleActionUpdated} lessonResources={lessonResources} studyResources={studyResources} programResources={programResources} allAssets={allAssets} key="actionEdit" />);
    else if (copySection) result.push(<SectionCopy copySection={copySection} venueId={venue.id} updatedCallback={handleUpdated} />);
    return result;
  };

  const getEditContent = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle as="a" variant="success"><i className="fas fa-plus"></i></Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={(e) => { e.preventDefault(); createSection(); }}><i className="fas fa-plus"></i> Create New</Dropdown.Item>
          <Dropdown.Item onClick={(e) => { e.preventDefault(); duplicateSection(); }}><i className="fas fa-copy"></i> Copy Existing</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };


  return (
    <Layout>
      <Container>
        <h1>{lesson?.name}: {venue?.name}</h1>
        <Row>
          <Col lg={8}>
            <div className="scrollingList">
              <DisplayBox headerText="Sections" headerIcon="none" editContent={getEditContent()}>
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
