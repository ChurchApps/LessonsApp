import React from "react";
import { Accordion, Button, Card } from "react-bootstrap"


export const Intro = () => {
    return (<Card>
        <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="intro">
                Intro
            </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="intro">
            <Card.Body>
                <p><i><b>Materials:</b> Lab coat, ball</i></p>
                <table className="table table-sm">
                    <tr><th>Resource</th><th>Downloads</th></tr>
                    <tr>
                        <td>Title Slide</td>
                        <td><a href="about:blank"><i className="fas fa-file-image"></i></a></td>
                    </tr>
                    <tr>
                        <td>Timer Video</td>
                        <td><a href="about:blank"><i className="fas fa-file-video"></i></a></td>
                    </tr>
                </table>
                <b>Facilitator:</b><br />
                <p><i style={{ color: "#999" }}>Play Title Slide and Timer Video</i></p>
                <p>Today we are beginning a brand-new series called Power Up! Power is a great thing. Have you ever been out of power at your house? It’s not fun! When you lose power, you can’t turn on the lights, you can’t use the TV, you can’t play video games, you can’t even charge your phone or iPad! Let’s answer this fun question: If you didn’t have power, what would you miss the most?</p>

                <b>Small Group Leader:</b><br />
                <p><i style={{ color: "#999" }}>Introduce yourself and go over the rules with your small group. Pass around the ball. Whoever has the ball gets to talk.</i></p>
                <p>If you didn’t have power, what would you miss the most?</p>

                <b>Facilitator:</b><br />
                <p><i style={{ color: "#999" }}>Play Title Slide</i></p>
                <p>Someone raise your hand and tell me what you would miss the most.</p>
                <p><i style={{ color: "#999" }}>Walk around with the microphone and allow a few kids to give their answers and let them share some of their reasoning. Then tell the kids what you would miss).</i></p>
                <p>Power helps us do all sorts of things. Did you know we have power inside of us? It’s not the electricity kind. The Bible tells us that God gives us the same power that God used to raise Jesus from the dead! God gives us the power to do all sorts of difficult things. Let’s check in with Herman and Rusty to see what is happening this week at the lab.</p>
            </Card.Body>
        </Accordion.Collapse>
    </Card>);
}
