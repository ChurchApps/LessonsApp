import React from "react";
import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom";
import { LessonInterface, StudyInterface, ProgramInterface } from ".";


interface Props {
  lesson: LessonInterface,
  study: StudyInterface,
  program: ProgramInterface
}

export const Lesson: React.FC<Props> = (props) => {
  const url = "/" + props.program.slug + "/" + props.study.slug + "/" + props.lesson.slug + "/";

  return (
    <Link to={url} style={{ textDecoration: "none", color: "inherit" }} >
      <Row style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
        <Col xl={3}>
          <Link to={url}><img src={props.lesson.image} className="img-fluid" alt={props.lesson.name} /></Link>
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
