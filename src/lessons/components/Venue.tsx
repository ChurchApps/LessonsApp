import React from "react";
import { VenueInterface, Downloads, Section, ResourceInterface } from ".";
import { Accordion, Row, Col } from "react-bootstrap"
import { useReactToPrint } from "react-to-print";

interface Props {
  venue: VenueInterface,
  resources: ResourceInterface[]
}

export const Venue: React.FC<Props> = (props) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current
  })

  const getSections = () => {
    const sections: JSX.Element[] = [];

    props.venue.sections?.forEach(s => {
      sections.push(<Section section={s} resources={props.resources} />);
    });
    return <Accordion defaultActiveKey={props.venue.sections[0].id}>{sections}</Accordion>
  }

  return (<>
    <br /><br />
    <Row>
      <Col><h4>{props.venue.name}</h4></Col>
      <Col>
        <Downloads resources={props.resources} />
        <button type="button" className="btn btn-sm btn-primary" key={"print" + props.venue.id} onClick={handlePrint} title="print" style={{ float: "right", marginRight: 10 }} ><i className="fas fa-print"></i></button>
      </Col>
    </Row>
    <div ref={contentRef}>
      <h2 className="printOnly">{props.venue.name} Instructions</h2>
      {getSections()}
    </div>
  </>);
}
