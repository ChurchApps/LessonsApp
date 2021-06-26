import React from "react";
import { DisplayBox, ApiHelper, Loading, SectionInterface, RoleInterface, ActionInterface, SectionEdit, RoleEdit, ActionEdit, ArrayHelper, VenueInterface } from "./components"
import { Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };


export const VenuePage = ({ match }: RouteComponentProps<TParams>) => {
  const [venue, setVenue] = React.useState<VenueInterface>(null);
  const [sections, setSections] = React.useState<SectionInterface[]>(null);
  const [roles, setRoles] = React.useState<RoleInterface[]>(null);
  const [actions, setActions] = React.useState<ActionInterface[]>(null);
  const [editSection, setEditSection] = React.useState<SectionInterface>(null);
  const [editRole, setEditRole] = React.useState<RoleInterface>(null);
  const [editAction, setEditAction] = React.useState<ActionInterface>(null);

  const loadData = () => {
    ApiHelper.get("/venues/" + match.params.id, "LessonsApi").then((v: VenueInterface) => {
      setVenue(v);
      ApiHelper.get("/sections/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setSections(data); });
      ApiHelper.get("/roles/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setRoles(data); });
      ApiHelper.get("/actions/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setActions(data); });
    });

  };

  React.useEffect(loadData, []);

  const clearEdits = () => { setEditSection(null); setEditRole(null); setEditAction(null); }
  const handleUpdated = () => { loadData(); setEditSection(null); setEditRole(null); setEditAction(null); };

  const getRows = () => {
    const result: JSX.Element[] = [];
    sections.forEach(s => {
      result.push(<tr className="sectionRow">
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditSection(s) }}><i className="fas fa-tasks"></i> {s.name}</a></td>
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditRole({ lessonId: venue.lessonId, sectionId: s.id }) }}><i className="fas fa-plus"></i></a></td>
      </tr>);
      getRoles(s.id).forEach(r => result.push(r));
    });
    return result;
  }

  const getRoles = (sectionId: string) => {
    const result: JSX.Element[] = [];
    if (roles) {
      ArrayHelper.getAll(roles, "sectionId", sectionId).forEach(s => {
        result.push(<tr className="roleRow">
          <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditRole(s) }}><i className="fas fa-user-alt"></i> {s.name}</a></td>
          <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditAction({ lessonId: venue.lessonId, roleId: s.id }) }}><i className="fas fa-plus"></i></a></td>
        </tr>);
        getActions(s.id).forEach(i => result.push(i));
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
    if (editSection) result.push(<SectionEdit section={editSection} updatedCallback={handleUpdated} />)
    else if (editRole) result.push(<RoleEdit role={editRole} updatedCallback={handleUpdated} />)
    else if (editAction) result.push(<ActionEdit action={editAction} updatedCallback={handleUpdated} />)
    return result;
  }

  const getEditContent = () => {
    return (<a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditSection({ lessonId: venue.lessonId, venueId: venue.id }) }}><i className="fas fa-plus"></i></a>);
  }

  return (<>
    <h1>Sections</h1>
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
