import { Card, Accordion, Button } from "react-bootstrap";
import { SectionInterface, ResourceInterface, ActionInterface, ArrayHelper, CustomizationInterface } from "@/utils";
import { Action } from "./Action";

type Props = {
  section: SectionInterface;
  resources: ResourceInterface[];
  toggleActive: (id: string) => void;
  activeSectionId: string;
  customizations?: CustomizationInterface[]
};

export function Section(props: Props) {

  const getActions = (actions: ActionInterface[]) => {
    const result: JSX.Element[] = [];
    actions.forEach((a) => {
      if (!shouldHide(a.id)) {
        result.push(<Action action={a} resources={props.resources} key={a.id} />);
      }
    });
    return result;
  };

  const shouldHide = (id: string) => {
    let result = false;
    if (props.customizations?.length > 0) {
      result = ArrayHelper.getAll(props.customizations, "contentId", id).length > 0;
    }
    return result;
  }

  const getParts = () => {
    const result: JSX.Element[] = [];
    props.section?.roles?.forEach((r) => {
      if (!shouldHide(r.id)) result.push(
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

  const getMaterials = () => {
    const downloads = [];
    props.section.roles?.forEach(r => {
      r.actions.forEach(a => {
        if (a.actionType === "Download") downloads.push(a.content);
      })
    })
    if (props.section.materials || downloads) {
      return (<div className="materials">
        <b>Materials:</b> {props.section.materials} {downloads}
      </div>)
    }
  }



  if (shouldHide(props.section?.id)) return <></>
  return (
    <Card>
      <Card.Header className={props.activeSectionId === props.section?.id ? "active" : ""}>
        <Accordion.Toggle as={Button} variant="link" className="text-decoration-none" eventKey={props.section.id} onClick={() => { props.toggleActive(props.section.id); }} >
          {props.section.name}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={props.section.id}>
        <Card.Body>
          {getMaterials()}
          {getParts()}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
