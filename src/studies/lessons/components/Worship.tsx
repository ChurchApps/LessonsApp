import React from "react";
import { Accordion, Button, Card } from "react-bootstrap"


export const Worship = () => {
    return (<Card>
        <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="worship">
                Worship
            </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="worship">
            <Card.Body>
                <div className="part">
                    <div className="role"><span>Facilitator</span></div>
                    <ul className="actions">
                        <li>Select worship music of your choice</li>
                    </ul>
                </div>
            </Card.Body>
        </Accordion.Collapse>
    </Card>);
}
