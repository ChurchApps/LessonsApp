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
                <p><b>Instructions:</b> Split the kids into small groups</p>
            </Card.Body>
        </Accordion.Collapse>
    </Card>);
}
