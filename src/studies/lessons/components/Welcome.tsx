import React from "react";
import { Accordion, Button, Card } from "react-bootstrap"


export const Welcome = () => {
    return (<Card>
        <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="welcome">
                Welcome
            </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="welcome">
            <Card.Body>
                <p><i><b>Materials:</b> Lab coat</i></p>
                <table className="table table-sm">
                    <tr><th>Resource</th><th>Downloads</th></tr>
                    <tr>
                        <td>Title Slide</td>
                        <td><a href="about:blank"><i className="fas fa-image"></i></a></td>
                    </tr>
                </table>
                <p><b>Facilitator:</b> Welcome to Ark Kids! On Sunday we celebrated Easter. Easter is about celebrating the truth that Jesus, our Lord and Savior, is alive! Because He is alive, those who have said, “Yes” to Him can live forever in heaven and have an abundant life here on Earth. That is great news! And that is a reason to praise God. </p>
            </Card.Body>
        </Accordion.Collapse>
    </Card>);
}
