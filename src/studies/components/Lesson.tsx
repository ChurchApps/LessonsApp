import React from "react";
import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom";
import { LessonInterface } from "../../helpers";


interface Props {
  lesson: LessonInterface
}

export const Lesson: React.FC<Props> = (props) => {
  return (
    <Link to="/studies/1/lessons/1" style={{ textDecoration: "none", color: "inherit" }} >
      <Row style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
        <Col xl={3}>
          <Link to="/studies/1/lessons/1"><img src={props.lesson.image} className="img-fluid" alt={props.lesson.name} /></Link>
        </Col>
        <Col xl={9}>
          <div className="title">{props.lesson.name}</div>
          <h3>{props.lesson.title}</h3>
          <p>{props.lesson.description}</p>
        </Col>
      </Row>
    </Link>
  );
}
