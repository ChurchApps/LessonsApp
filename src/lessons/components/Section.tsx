import React from "react";
import { Accordion, Card, Button } from "react-bootstrap"
import { ActionInterface, SectionInterface, ResourceInterface } from "../../helpers";
import { Action } from "./Action"

interface Props {
  section: SectionInterface,
  resources: ResourceInterface[]
}

export const Section: React.FC<Props> = (props) => {

  const getActions = (actions: ActionInterface[]) => {
    const result: JSX.Element[] = [];
    actions.forEach(a => { result.push(<Action action={a} resources={props.resources} />) });
    return result;
  }

  const getParts = () => {
    const result: JSX.Element[] = [];
    props.section?.roles?.forEach(r => {
      result.push(<div className="part">
        <div className="role"><span>{r.name}</span></div>
        {getActions(r.actions)}
      </div>);
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

