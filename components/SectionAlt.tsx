import { Card, Accordion, Button } from "react-bootstrap";
import { SectionInterface, ResourceInterface } from "@utils/index";
import { ActionAlt } from "./ActionAlt";

type Props = {
  section: SectionInterface;
  resources: ResourceInterface[];
};

export function SectionAlt({ section, resources }: Props) {
  const parts = section?.roles.map((role) => {
    const result: JSX.Element[] = [];
    role?.actions.forEach((a) => {
      result.push(<ActionAlt action={a} resources={resources} role={role} />);
    });
    return result;
  });

  const materials = section.materials && (
    <div className="materials">
      <b>Materials:</b> {section.materials}
    </div>
  );

  return (
    <Card>
      <Card.Header>
        <Accordion.Toggle as={Button} variant="link" eventKey={section.id}>
          {section.name}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={section.id}>
        <Card.Body>
          {materials}
          {parts}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
