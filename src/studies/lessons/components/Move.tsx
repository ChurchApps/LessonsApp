import React from "react";
import { Accordion, Button, Card } from "react-bootstrap"


export const Move = () => {
    return (<Card>
        <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="move">
                Move
            </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="move">
            <Card.Body>
                <div className="part">
                    <div className="role"><span>Facilitator</span></div>
                    <ul className="actions">
                        <li>Split the kids into small groups</li>
                    </ul>
                </div>
            </Card.Body>
        </Accordion.Collapse>
    </Card>);
}
