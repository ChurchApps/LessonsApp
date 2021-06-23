import React from "react";
import { Accordion, Card, Button } from "react-bootstrap"


export const AtHome = () => {
    return (<>
        <br /><br />
        <h3>At Home</h3>
        <Accordion>

            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="watch">
                        Watch as a Family
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="watch">
                    <Card.Body>
                        <div className="videoWrapper">
                            <iframe width="992" height="558" src="https://www.youtube.com/embed/inVOXN6BrV8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>

            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="bigDo">
                        Do "The Big Do" Together
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="bigDo">
                    <Card.Body>
                        <p><b>The Big Do:</b> Make and send a card to an elderly relative telling them how much God loves them!</p>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>

        </Accordion>
    </>);
}
