import React from "react";
import { VenueInterface, Downloads, Section } from ".";
import { Accordion, Row, Col } from "react-bootstrap"

interface Props { venue: VenueInterface }

export const Venue: React.FC<Props> = (props) => {


  const getSections = () => {
    const sections: JSX.Element[] = [];

    props.venue.sections?.forEach(s => {
      sections.push(<Section section={s} />);
    });
    return <Accordion>{sections}</Accordion>
  }

  return (<>
    <br /><br />
    <Row>
      <Col><h4>{props.venue.name}</h4></Col>
      <Col>
        <Downloads />
      </Col>
    </Row>
    {getSections()}
  </>);
}
