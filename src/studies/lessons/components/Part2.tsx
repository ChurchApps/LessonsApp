import React from "react";
import { Accordion, Button, Card, Row, Col } from "react-bootstrap"


export const Part2 = () => {
    return (<Card>
        <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="part2">
                The Herman and Rusty Show, Part 2
            </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="part2">
            <Card.Body>
                <Row className="sectionResources">
                    <Col><b>Materials:</b> Lab Coat, The Obedient Heart Object Lesson</Col>
                    <Col><b>Resources:</b> Title Slide, Big Verse Slide, Big Point Slide <a href="about:blank"><i className="fas fa-file-archive"></i></a></Col>
                </Row>

                <div className="part">
                    <div className="role"><span>Facilitator</span></div>
                    <ul className="actions">
                        <li>Play Title Slide</li>
                    </ul>
                    <blockquote>
                        <p>Wow, it looks like disobeying has caused some big problems at the lab. Herman was so right. Jesus is the perfect example of obedience. In fact, check out our Big Verse...</p>
                    </blockquote>
                    <ul className="actions">
                        <li>Play Big Verse Slide</li>
                    </ul>
                    <blockquote>
                        <p><i>Philippians 2:8 (NIrV), “He was humble and obeyed God completely.”</i> He obeyed His Heavenly Father and died on the cross for us. The fact that He died and then came back to life brings huge blessings to us.</p>
                        <p>But maybe you’re thinking, (Insert your name), of course Jesus can obey, but it’s too hard for me. I’ve felt that way before, too. I need a Lab Assistant to help me out. This represents my heart, that invisible part of us that can follow God or ignore Him. Let’s see how well it obeys. Ok, tell it to move. (Have the heart disobey the command) There are times we may feel like we can’t obey, but we can make that choice. Even when we don’t feel like it, with our hearts connected to Him, we always have Someone to help us make the wise choice. Now let’s try again. (Have the heart follow the command) Let’s take a look at our Big Story to hear more about how Jesus’ obedience changed eternity and brought us huge blessings.</p>
                    </blockquote>
                </div>


            </Card.Body>
        </Accordion.Collapse>
    </Card >);
}
