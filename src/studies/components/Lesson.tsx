import React from "react";
import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom";


interface Props {
    videoId?: string,
    description: string,
    title: string
}

export const Lesson: React.FC<Props> = (props) => {
    return (
        <Link to="/studies/1/lessons/1" style={{ textDecoration: "none", color: "inherit" }} >
            <Row style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
                <Col xl={3}>
                    <Link to="/studies/1/lessons/1"><img src={"https://i.ytimg.com/vi/" + props.videoId + "/maxresdefault.jpg"} className="img-fluid" alt="Lesson 1" /></Link>
                </Col>
                <Col xl={9}>
                    <div className="title">The Adventures of Herman and Rusty</div>
                    <h3>{props.title}</h3>
                    <p>{props.description}</p>
                </Col>
            </Row>
        </Link>
    );
}
