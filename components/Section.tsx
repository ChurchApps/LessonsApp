import { Card, Accordion, Button } from "react-bootstrap";
import {
  SectionInterface,
  ResourceInterface,
  ActionInterface,
} from "@/utils/index";
import { Action } from "./Action";

type Props = {
  section: SectionInterface;
  resources: ResourceInterface[];
  toggleActive: (id: string) => void;
  activeSectionId: string;
};

export function Section({
  section,
  resources,
  toggleActive,
  activeSectionId,
}: Props) {
  const getActions = (actions: ActionInterface[]) => {
    const result: JSX.Element[] = [];
    actions.forEach((a) => {
      result.push(<Action action={a} resources={resources} key={a.id} />);
    });
    return result;
  };

  const getParts = () => {
    const result: JSX.Element[] = [];
    section?.roles?.forEach((r) => {
      result.push(
        <div className="part" key={r.id}>
          <div className="role">
            <span>{r.name}</span>
          </div>
          {getActions(r.actions)}
        </div>
      );
    });
    return result;
  };

  const materials = section.materials && (
    <div className="materials">
      <b>Materials:</b> {section.materials}
    </div>
  );

  return (
    <Card>
      <Card.Header className={activeSectionId === section?.id ? "active" : ""}>
        <Accordion.Toggle
          as={Button}
          variant="link"
          className="text-decoration-none"
          eventKey={section.id}
          onClick={() => {
            toggleActive(section.id);
          }}
        >
          {section.name}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={section.id}>
        <Card.Body>
          {materials}
          {getParts()}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
