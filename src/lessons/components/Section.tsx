import React from "react";
import { Accordion, Card, Button } from "react-bootstrap"
import { SectionInterface } from "../../helpers";

interface Props {
  section: SectionInterface
}

export const Section: React.FC<Props> = (props) => {

  return (<Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="watch">
        Watch as a Family
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="watch">
      <Card.Body>
        <div className="videoWrapper">
          <iframe width="992" height="558" src="https://www.youtube.com/embed/inVOXN6BrV8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </Card.Body>
    </Accordion.Collapse>
  </Card>);
}

