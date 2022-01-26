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


  const [allAssets, setAllAssets] = useState<AssetInterface[]>(null);
  const { isAuthenticated } = ApiHelper;
  const router = useRouter();
  const pathId = router.query.id;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, []);
  useEffect(() => { if (isAuthenticated) { loadData(); } }, [pathId, isAuthenticated]);


  function loadData() {
    ApiHelper.get("/venues/public/" + pathId, "LessonsApi").then((v: VenueInterface) => {
      setVenue(v);
      ApiHelper.get("/lessons/" + v.lessonId, "LessonsApi").then((data: any) => {
        setLesson(data);
        ApiHelper.get("/studies/" + data.studyId, "LessonsApi").then((d: any) => { setStudy(d); });
      });
      ApiHelper.get("/sections/public/venue/" + v.id, "LessonsApi").then((data: any) => { setSections(data); });
      ApiHelper.get("/roles/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setRoles(data); });
      ApiHelper.get("/actions/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setActions(data); });
    });
  }


  const getRows = () => {
    const result: JSX.Element[] = [];
    sections.forEach((s) => {
      result.push(<tr className="sectionRow" key={`s-${s.id}`}>
        <td>
          <i className="fas fa-tasks"></i> {s.name}
        </td>
        <td></td>
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
            <i className="fas fa-user-alt"></i> {r.name}
          </td>
          <td></td>
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
              <i className="fas fa-check"></i> {a.actionType}: {a.content}
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
        <h1>{lesson?.name}: {venue?.name}</h1>
        <DisplayBox headerText="Sections" headerIcon="none">
          {getTable()}
        </DisplayBox>
      </Container>
    </Layout>
  );
}
