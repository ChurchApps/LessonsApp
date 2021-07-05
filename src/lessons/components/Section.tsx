import React from "react";
import { Accordion, Card, Button } from "react-bootstrap"
import { ActionInterface, SectionInterface } from "../../helpers";
import { Action } from "./Action"

interface Props {
  section: SectionInterface
}

export const Section: React.FC<Props> = (props) => {

  const getActions = (actions: ActionInterface[]) => {
    const result: JSX.Element[] = [];
    actions.forEach(a => { result.push(<Action action={a} />) });
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

  return (<Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey={props.section.id}>
        {props.section.name}
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey={props.section.id}>
      <Card.Body>
        {getParts()}
      </Card.Body>
    </Accordion.Collapse>
  </Card>);
}

