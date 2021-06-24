import React from "react";
import { Header, DisplayBox, Footer } from "./components"
import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"


export const ProgramPage = () => {
    const [mode, setMode] = React.useState("display");
    const handleEdit = () => setMode("edit");

    return (<>
        <h1>Program: High Voltage Elementary</h1>
        <Row>
            <Col xl={8}>
                <DisplayBox headerText="High Voltage Elementary" headerIcon="none" editFunction={handleEdit}>
                    <Row>
                        <Col><b>Name:</b> High Voltage Elementary</Col>
                    </Row>
                </DisplayBox>
            </Col>
        </Row>
    </>);
}
