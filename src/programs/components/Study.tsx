import React from "react";
import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom";
import { StudyInterface, ProgramInterface } from "."

interface Props {
  program: ProgramInterface,
  study: StudyInterface,
}

export const Study: React.FC<Props> = (props) => {

  const studyUrl = "/" + props.program.slug + "/" + props.study.slug;
  //<div className="title">The Adventures of Herman and Rusty</div>
  return (

    <Row style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
      <Col xl={3}>
        <Link to={studyUrl}><img src={props.study.image} className="img-fluid" alt={props.study.name} /></Link>
      </Col>
      <Col xl={9}>
        <h3><Link to={studyUrl} >{props.study.name}</Link></h3>
        <p><i>{props.study.shortDescription}</i></p>
        <p>{props.study.description}</p>
      </Col>
    </Row>
  );
}
