import React from "react";
import { Accordion, Button, Card } from "react-bootstrap"


export const Parts = () => {
    return (<>
        <Card>
            <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="part3">
                    The Herman and Rusty Show, Part 3
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="part3">
                <Card.Body>
                    <p>Not implemented</p>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
        <Card>
            <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="gameShow">
                    Herman and Rusty’s Great Big Review Game Show
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="gameShow">
                <Card.Body>
                    <p>Not implemented</p>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    </>);
}
