import React from "react";
import { Accordion, Row, Col } from "react-bootstrap"
import { Welcome, Worship, Move, Intro, Part1, Part2, BigStory, Parts } from ".";


export const Classroom = () => {
    return (<>
        <Row>
            <Col><h3>Classroom</h3></Col>
            <Col>
                <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle btn-sm float-right" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Downloads
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="about:blank"><i className="fas fa-file-video"></i> Videos</a>
                        <a className="dropdown-item" href="about:blank"><i className="fas fa-file-image"></i> Slides</a>
                    </div>
                </div>
            </Col>
        </Row>
        <Accordion defaultActiveKey="welcome">
            <Welcome />
            <Worship />
            <Move />
            <Intro />
            <Part1 />
            <Part2 />
            <BigStory />
            <Parts />
        </Accordion>
    </>);
}
