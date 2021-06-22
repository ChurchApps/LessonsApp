import React from "react";
import { Accordion, Button, Card, Row, Col } from "react-bootstrap"


export const BigStory = () => {
    return (<Card>
        <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="bigStory">
                Big Story Intro Video &amp; Big Story Video
            </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="bigStory">
            <Card.Body>
                <Row className="sectionResources">
                    <Col><b>Materials:</b> Lab Coat, Yes Cards</Col>
                    <Col><b>Resources:</b> Title Slide, Yes Slides 1-2 <a href="about:blank"><i className="fas fa-file-archive"></i></a></Col>
                </Row>

                <div className="part">
                    <div className="role"><span>Facilitator</span></div>
                    <ul className="actions">
                        <li>Play Title Slide</li>
                    </ul>
                    <blockquote>
                        <p>If you have never said, “Yes, I want Jesus to forgive me, be my best friend, and I will follow Him for the rest of my life,” then today is your day! I’d like everyone to close your eyes and bow your heads, so no one is distracted. If your parents are here, go over by them, so you can pray together. If you have already said, “Yes” to Jesus, I want you to give me a thumbs up. That’s awesome. You can put your hands down. If you’ve never said, “Yes” to Jesus before, and you want to say, “Yes” to Him right now and ask Him to forgive you, raise your hand. We’re going to pray altogether. Those of you who are already friends and followers of Jesus can join in, too. Repeat after me, and let’s pray... </p>
                    </blockquote>
                    <ul className="actions">
                        <li>Play Yes Slide 1</li>
                    </ul>
                    <blockquote>
                        <p>Dear God, I know everyone needs a Savior,  and I know I can’t save myself.  Jesus, I believe You are the Son of God. I believe You died on the cross for my sins and God raised You from the dead.</p>
                    </blockquote>
                    <ul className="actions">
                        <li>Play Yes Slide 2</li>
                    </ul>
                    <blockquote>
                        <p>Right now, I say you are my Lord, my Savior, and the One who forgives me.  Thank you, Jesus, that You are my best friend, because I’ve said, “Yes” to You. Amen.</p>
                    </blockquote>
                    <ul className="actions">
                        <li>Play Title Slide</li>
                    </ul>
                    <blockquote>
                        <p>If you prayed that prayer for the very first time today, I want you to raise your hand again. A Connector will hand you a card. Hold onto that card until checkout today and show it to the Connector who checks you out. We’re so glad you said, “Yes” to Jesus. Let’s stand up and worship Him now.</p>
                    </blockquote>
                </div>

            </Card.Body>
        </Accordion.Collapse>
    </Card >);
}
