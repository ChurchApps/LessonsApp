import React from "react";
import { Accordion, Button, Card, Row, Col } from "react-bootstrap"


export const Welcome = () => {
    return (<Card>
        <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="welcome">
                Welcome
            </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="welcome">
            <Card.Body>
                <Row className="sectionResources">
                    <Col><b>Materials:</b> Lab coat</Col>
                    <Col> <b>Resources:</b> Title Slide <a href="about:blank"><i className="fas fa-file-archive"></i></a></Col>
                </Row>
                <div className="part">
                    <div className="role"><span>Facilitator</span></div>
                    <blockquote>
                        <p>Welcome to Ark Kids! On Sunday we celebrated Easter. Easter is about celebrating the truth that Jesus, our Lord and Savior, is alive! Because He is alive, those who have said, “Yes” to Him can live forever in heaven and have an abundant life here on Earth. That is great news! And that is a reason to praise God.</p>
                    </blockquote>
                </div>
            </Card.Body>
        </Accordion.Collapse>
    </Card>);
}
