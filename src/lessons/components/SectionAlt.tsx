import React from "react";
import { Accordion, Card, Button } from "react-bootstrap"
import { RoleInterface } from "../../appBase/interfaces";
import { ActionInterface, SectionInterface, ResourceInterface } from "../../helpers";
import { ActionAlt } from "./ActionAlt"

interface Props {
  section: SectionInterface,
  resources: ResourceInterface[]
}

export const SectionAlt: React.FC<Props> = (props) => {

  const getActions = (actions: ActionInterface[], role: RoleInterface) => {
    const result: JSX.Element[] = [];
    actions.forEach(a => { result.push(<ActionAlt action={a} resources={props.resources} role={role} />) });
    return result;
  }

  const getParts = () => {
    const result: JSX.Element[] = [];
    props.section?.roles?.forEach(r => {
      result.push(<>
        {getActions(r.actions, r)}
      </>);
    });
    return result;
  }

  const getMaterials = () => {
    if (props.section.materials) return (<div className="materials"><b>Materials:</b> {props.section.materials}</div>)
  }

  return (<Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey={props.section.id}>
        {props.section.name}
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey={props.section.id}>
      <Card.Body>
        {getMaterials()}
        {getParts()}
      </Card.Body>
    </Accordion.Collapse>
  </Card>);
}

