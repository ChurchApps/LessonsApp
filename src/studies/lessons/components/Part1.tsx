import React from "react";
import { Accordion, Button, Card } from "react-bootstrap"


export const Part1 = () => {
    return (<Card>
        <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="part1">
                The Herman and Rusty Show, Part 1
            </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="part1">
            <Card.Body>
                <p><i><b>Materials:</b> Lab coat, ball, writing utensils</i></p>
                <table className="table table-sm">
                    <tr><th>Resource</th><th>Downloads</th></tr>
                    <tr>
                        <td>Title Slide</td>
                        <td><a href="about:blank"><i className="fas fa-file-image"></i></a></td>
                    </tr>
                    <tr>
                        <td>Big Verse Slide</td>
                        <td><a href="about:blank"><i className="fas fa-file-image"></i></a></td>
                    </tr>
                    <tr>
                        <td>Big Point Slide</td>
                        <td><a href="about:blank"><i className="fas fa-file-image"></i></a></td>
                    </tr>
                </table>
                <b>Facilitator:</b><br />
                <p><i style={{ color: "#999" }}>Play Title Slide</i></p>
                <p>It looks like Ethel and Rusty are having a hard time obeying the rules around the lab. Have you ever had a hard time obeying? Being obedient can be really difficult, especially when you don’t want to do what is asked of you. Let’s see what our Big Point has to say about this. It says...</p>
                <p><i style={{ color: "#999" }}>Play Big Point Slide</i></p>
                <p><b>I Can Obey!</b> God gives us the power and ability to do hard things and being obedient is one of them. Even when we don’t feel like it, or it doesn’t sound fun, we have the power inside of us to obey. And when we do obey, good things come of it! Let’s turn to our small groups to do something that will help us understand the importance of obedience.</p>

                <b>Small Group Leader:</b><br />
                <p><i style={{ color: "#999" }}>Give each child one sheet of paper and a writing utensil. Read the following instructions to them carefully. At the end of the activity, they should have drawn a dog (OLDER) or a house (YOUNGER). When they are finished, ask the following questions.</i></p>
                <p><b>Older Kids</b></p>
                <ol type="1">
                    <li>Draw 6 large circles in a row touching.</li>
                    <li>In the 4th and 5th circles, draw 3 dots.</li>
                    <li>Draw a very small “U” under the 4th and 5th circle connecting them.</li>
                    <li>Draw an upside-down larger U that connects the 4th and the 5th circle.</li>
                    <li>Just above where the 4th and 5th circles touch, draw a small, horizontal oval and color it in.</li>
                    <li>In the upside-down “U”, draw two small circles and color them in.</li>
                    <li>Draw a large oval touching the left side of the upside-down U.</li>
                    <li>Draw a large oval touching the right side of the upside-down U.</li>
                    <li>Connect the right oval to the 6th circle with a curved line.</li>
                    <li>Connect the left oval to the 1st circle with a curved line.</li>
                    <li>Draw a V with both ends touching the left side of the larger curved line.</li>
                    <li>On the bottom half of the first circle, draw three vertical lines.</li>
                    <li>On the bottom half of the second circle, draw three vertical lines.</li>
                    <li>On the bottom half of the third circle, draw three vertical lines.</li>
                    <li>On the bottom half of the sixth circle, draw three vertical lines.</li>
                </ol>
                <p>Now spin your paper around (upside down). What did you draw? A dog.</p>
                <p><b>Younger Kids</b></p>
                <ol type="1">
                    <li>Draw a large square.</li>
                    <li>Draw a small rectangle inside the square at the bottom edge.</li>
                    <li>Draw a smaller square inside the larger square toward one side.</li>
                    <li>Inside the smaller square, draw a line going up and down and a line going side to side.</li>
                    <li>Draw a large triangle at the top of the large square.</li>
                    <li>On one side of the triangle draw a rectangle going up and down</li>
                </ol>
                <p>What did you draw? A house.</p>
                <ul>
                    <li>What happened when you followed all the instructions? <b>I drew a dog/house.</b></li>
                    <li>What happened if you didn’t follow or understand the instructions? <b>You wouldn’t have created anything. Or you’d create something that didn’t make sense.</b></li>
                    <li>Why do you think it is important to obey? <b>Good things happen when you obey!</b></li>
                </ul>

                <b>Facilitator:</b><br />
                <p><i style={{ color: "#999" }}>Play Big Point Slide</i></p>
                <p>Be honest, raise your hand if your drawing did not end up like it was supposed to. Obeying is a lot like following instructions. It’s doing what you are told to do right away! Being obedient can be difficult, and it may not always be fun. But God gives us the power to obey even when it’s hard and He promises to bless us when we do obey. Let’s say our Big Point all together...</p>
                <p><i style={{ color: "#999" }}>Play Big Point Slide</i></p>
                <p><b>I Can Obey!</b> Let’s see if Rusty and Ethel have learned the importance of obedience.</p>

            </Card.Body>
        </Accordion.Collapse>
    </Card>);
}
