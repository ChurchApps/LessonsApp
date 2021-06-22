import React from "react";
import { Accordion, Button, Card, Row, Col } from "react-bootstrap"


export const Intro = () => {
    return (<Card>
        <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="intro">
                Intro
            </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="intro">
            <Card.Body>
                <Row className="sectionResources">
                    <Col><b>Materials:</b> Lab coat, ball</Col>
                    <Col> <b>Resources:</b> Title Slide, Timer Video <a href="about:blank"><i className="fas fa-file-archive"></i></a></Col>
                </Row>

                <div className="part">
                    <div className="role"><span>Facilitator</span></div>
                    <ul className="actions">
                        <li>Play Title Slide and Timer Video</li>
                    </ul>
                    <blockquote>
                        <p>Today we are beginning a brand-new series called Power Up! Power is a great thing. Have you ever been out of power at your house? It’s not fun! When you lose power, you can’t turn on the lights, you can’t use the TV, you can’t play video games, you can’t even charge your phone or iPad! Let’s answer this fun question: If you didn’t have power, what would you miss the most?</p>
                    </blockquote>
                </div>

                <div className="part">
                    <div className="role"><span>Small Group Leader</span></div>
                    <ul className="actions">
                        <li>Introduce yourself and go over the rules with your small group. Pass around the ball. Whoever has the ball gets to talk.</li>
                    </ul>
                    <blockquote>
                        <p>If you didn’t have power, what would you miss the most?</p>
                    </blockquote>
                </div>

                <div className="part">
                    <div className="role"><span>Facilitator</span></div>
                    <ul className="actions">
                        <li>Play Title Slide</li>
                    </ul>
                    <blockquote>
                        <p>Someone raise your hand and tell me what you would miss the most.</p>
                    </blockquote>
                    <ul className="actions">
                        <li>Walk around with the microphone and allow a few kids to give their answers and let them share some of their reasoning. Then tell the kids what you would miss.</li>
                    </ul>
                    <blockquote>
                        <p>Power helps us do all sorts of things. Did you know we have power inside of us? It’s not the electricity kind. The Bible tells us that God gives us the same power that God used to raise Jesus from the dead! God gives us the power to do all sorts of difficult things. Let’s check in with Herman and Rusty to see what is happening this week at the lab.</p>
                    </blockquote>
                </div>

            </Card.Body>
        </Accordion.Collapse>
    </Card >);
}
