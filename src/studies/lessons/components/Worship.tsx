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
                <p><b>Instructions:</b> Select worship music of your choice</p>
            </Card.Body>
        </Accordion.Collapse>
    </Card>);
}
