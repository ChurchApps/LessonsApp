import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Container, Dropdown } from "react-bootstrap";
import { Layout, DisplayBox, Loading, SectionEdit, RoleEdit, ActionEdit, SectionCopy } from "@/components";
import { VenueInterface, LessonInterface, StudyInterface, SectionInterface, RoleInterface, ActionInterface, ResourceInterface, AssetInterface, ApiHelper, ArrayHelper, CopySectionInterface, CustomizationInterface } from "@/utils";

export default function Venue() {
  const [venue, setVenue] = useState<VenueInterface>(null);
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const [study, setStudy] = useState<StudyInterface>(null);
  const [sections, setSections] = useState<SectionInterface[]>(null);
  const [roles, setRoles] = useState<RoleInterface[]>(null);
  const [actions, setActions] = useState<ActionInterface[]>(null);
  const [customizations, setCustomizations] = useState<CustomizationInterface[]>([]);


  const { isAuthenticated } = ApiHelper;
  const router = useRouter();
  const pathId = router.query.id;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, []);
  useEffect(() => { if (isAuthenticated) { loadData(); } }, [pathId, isAuthenticated]);


  function loadData() {
    ApiHelper.get("/venues/public/" + pathId, "LessonsApi").then((v: VenueInterface) => {
      setVenue(v);
      ApiHelper.get("/lessons/public/" + v.lessonId, "LessonsApi").then((data: any) => {
        setLesson(data);
        ApiHelper.get("/studies/public/" + data.studyId, "LessonsApi").then((d: any) => { setStudy(d); });
      });
      ApiHelper.get("/sections/public/venue/" + v.id, "LessonsApi").then((data: any) => { setSections(data); });
      ApiHelper.get("/roles/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setRoles(data); });
      ApiHelper.get("/actions/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setActions(data); });
      ApiHelper.get("/customizations/venue/" + v.id, "LessonsApi").then(data => setCustomizations(data));
    });
  }

  const toggleTrash = async (contentType: string, contentId: string) => {
    const contentItems = ArrayHelper.getAll(customizations, "contentType", contentType);
    const item = ArrayHelper.getOne(contentItems, "contentId", contentId);
    if (item) {
      await ApiHelper.delete("/customizations/" + item.id, "LessonsApi");
    } else {
      const c: CustomizationInterface = { contentType, contentId, venueId: venue.id, action: "remove" }
      await ApiHelper.post("/customizations", [c], "LessonsApi");
    }
    ApiHelper.get("/customizations/venue/" + venue.id, "LessonsApi").then(data => setCustomizations(data));
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    sections.forEach((s) => {
      result.push(<tr className="sectionRow hoverHighlight" key={`s-${s.id}`}>
        <td>
          <i className="fas fa-tasks"></i> {s.name}
        </td>
        <td>
          <a href="about:blank" onClick={(e) => { e.preventDefault(); toggleTrash("section", s.id) }}>
            <i className="fas fa-trash-alt text-danger"></i>
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
        result.push(<tr className="roleRow hoverHighlight" key={`r-${r.id}`}>
          <td>
            <i className="fas fa-user-alt"></i> {r.name}
          </td>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); toggleTrash("role", r.id) }}>
              <i className="fas fa-trash-alt text-danger"></i>
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

        const removedClass = (ArrayHelper.getOne(customizations, "contentId", a.id)) ? " removed" : "";
        result.push(
          <tr className={"actionRow hoverHighlight" + removedClass} key={`a-${a.id}`}>
            <td>
              <span><i className="fas fa-check"></i> {a.actionType}: {a.content}</span>
            </td>
            <td>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); toggleTrash("action", a.id) }}>
                <i className="fas fa-trash-alt text-danger"></i>
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



  return (
    <Layout>
      <Container>
        <h1>Customize Lesson</h1>
        <p>You can customize each lesson for you church by removing sections you do not wish to use.</p>
        <h4>{study?.name} - {lesson?.name}: {venue?.name}</h4>
        <DisplayBox headerText="Sections" headerIcon="none">
          {getTable()}
        </DisplayBox>
      </Container>
    </Layout>
  );
}
