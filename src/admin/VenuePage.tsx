import React from "react";
import { DisplayBox, ApiHelper, Loading, SectionInterface, RoleInterface, ActionInterface, SectionEdit, RoleEdit, ActionEdit, ArrayHelper, VenueInterface, LessonInterface } from "./components"
import { Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };


export const VenuePage = ({ match }: RouteComponentProps<TParams>) => {
  const [venue, setVenue] = React.useState<VenueInterface>(null);
  const [lesson, setLesson] = React.useState<LessonInterface>(null);
  const [sections, setSections] = React.useState<SectionInterface[]>(null);
  const [roles, setRoles] = React.useState<RoleInterface[]>(null);
  const [actions, setActions] = React.useState<ActionInterface[]>(null);
  const [editSection, setEditSection] = React.useState<SectionInterface>(null);
  const [editRole, setEditRole] = React.useState<RoleInterface>(null);
  const [editAction, setEditAction] = React.useState<ActionInterface>(null);

  const loadData = () => {
    ApiHelper.get("/venues/" + match.params.id, "LessonsApi").then((v: VenueInterface) => {
      setVenue(v);
      ApiHelper.get("/lessons/" + v.lessonId, "LessonsApi").then((data: any) => { setLesson(data); });
      ApiHelper.get("/sections/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setSections(data); });
      ApiHelper.get("/roles/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setRoles(data); });
      ApiHelper.get("/actions/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setActions(data); });
    });

  };

  React.useEffect(loadData, []);

  const clearEdits = () => { setEditSection(null); setEditRole(null); setEditAction(null); }
  const handleUpdated = () => { loadData(); setEditSection(null); setEditRole(null); setEditAction(null); };

  const handleSectionUpdated = (section: SectionInterface, created: boolean) => {
    handleUpdated();
    if (created) createRole(section.id);
  }

  const handleRoleUpdated = (role: RoleInterface, created: boolean) => {
    handleUpdated();
    if (created) createAction(role.id);
  }


  const handleActionUpdated = (action: ActionInterface, created: boolean) => {
    console.log(action)
    handleUpdated();
    if (created) createAction(action.roleId, action.sort + 1);
  }


  const createSession = () => {
    clearEdits();
    setEditSection({ lessonId: venue.lessonId, venueId: venue.id, sort: sections.length + 1 })
  }

  const createRole = (sectionId: string) => {
    const sort = ArrayHelper.getAll(roles, "sectionId", sectionId).length + 1;
    clearEdits();
    setEditRole({ lessonId: venue.lessonId, sectionId: sectionId, sort: sort })
  }

  const createAction = (roleId: string, sort?: number) => {
    if (!sort) sort = ArrayHelper.getAll(actions, "roleId", roleId).length + 1;
    clearEdits();
    setEditAction({ lessonId: venue.lessonId, roleId: roleId, sort: sort })
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    sections.forEach(s => {
      result.push(<tr className="sectionRow">
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditSection(s) }}><i className="fas fa-tasks"></i> {s.name}</a></td>
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); createRole(s.id) }}><i className="fas fa-plus"></i></a></td>
      </tr>);
      getRoles(s.id).forEach(r => result.push(r));
    });
    return result;
  }

  const getRoles = (sectionId: string) => {
    const result: JSX.Element[] = [];
    if (roles) {
      ArrayHelper.getAll(roles, "sectionId", sectionId).forEach(r => {
        result.push(<tr className="roleRow">
          <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditRole(r) }}><i className="fas fa-user-alt"></i> {r.name}</a></td>
          <td><a href="about:blank" onClick={(e) => { e.preventDefault(); createAction(r.id) }}><i className="fas fa-plus"></i></a></td>
        </tr>);
        getActions(r.id).forEach(i => result.push(i));
      });
    }
    return result;
  }

  const getActions = (roleId: string) => {
    const result: JSX.Element[] = [];
    if (actions) {
      ArrayHelper.getAll(actions, "roleId", roleId).forEach((a: ActionInterface) => {
        result.push(<tr className="actionRow">
          <td colSpan={2}><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditAction(a) }}><i className="fas fa-check"></i> {a.actionType}: {a.content}</a></td>
        </tr>);
      });
    }
    return result;
  }

  const getTable = () => {
    if (sections === null) return <Loading />
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
    if (editSection) result.push(<SectionEdit section={editSection} updatedCallback={handleSectionUpdated} />)
    else if (editRole) result.push(<RoleEdit role={editRole} updatedCallback={handleRoleUpdated} />)
    else if (editAction) result.push(<ActionEdit action={editAction} updatedCallback={handleActionUpdated} />)
    return result;
  }

  const getEditContent = () => {
    return (<a href="about:blank" onClick={(e) => { e.preventDefault(); createSession() }}><i className="fas fa-plus"></i></a>);
  }

  return (<>
    <h1>{lesson?.name}: {venue?.name}</h1>
    <Row>
      <Col lg={8}>
        <DisplayBox headerText="Sections" headerIcon="none" editContent={getEditContent()} >
          {getTable()}
        </DisplayBox>
      </Col>
      <Col lg={4}>
        {getSidebar()}
      </Col>
    </Row>

  </>);
}
