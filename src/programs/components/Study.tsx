import React from "react";
import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom";
import { StudyInterface } from "."

interface Props {
  study?: StudyInterface,
}

export const Study: React.FC<Props> = (props) => {
  //<div className="title">The Adventures of Herman and Rusty</div>
  return (
    <Link to={"/studies/" + props.study.id} style={{ textDecoration: "none", color: "inherit" }} >
      <Row style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
        <Col xl={3}>
          <Link to={"/studies/" + props.study.id}><img src={props.study.image} className="img-fluid" alt={props.study.name} /></Link>
        </Col>
        <Col xl={9}>
          <h3>{props.study.name}</h3>
          <p><i>{props.study.shortDescription}</i></p>
          <p>{props.study.description}</p>
        </Col>
      </Row>
    </Link>
  );
}
