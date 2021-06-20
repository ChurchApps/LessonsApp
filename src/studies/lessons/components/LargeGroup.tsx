import React from "react";
import { Accordion } from "react-bootstrap"
import { Welcome, Worship, Move, Intro, Part1, Parts } from ".";


export const LargeGroup = () => {
    return (<>
        <h3>Large Group</h3>
        <Accordion defaultActiveKey="welcome">
            <Welcome />
            <Worship />
            <Move />
            <Intro />
            <Part1 />
            <Parts />
        </Accordion>
    </>);
}
