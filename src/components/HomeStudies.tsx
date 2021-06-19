import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap"


export const HomeStudies = () => {
    return (<>
        <div className="homeSection">
            <Container>
                <h2 className="text-center">Browse <span>Available Studies</span></h2>
                <h3>High Voltage Kids</h3>
                <Row>
                    <Col>
                        Family Mechanics
                    </Col>
                </Row>
                <h3>The Ark</h3>
            </Container>
        </div>
    </>);
}
