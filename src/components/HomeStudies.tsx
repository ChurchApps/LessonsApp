import React from "react";
import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom";


export const HomeStudies = () => {
    return (<>
        <div className="homeSection">
            <Container>
                <h2 className="text-center">Browse <span>Available Studies</span></h2>

                <h3>The Ark Kids</h3>
                <Row>
                    <Col xl={4}>
                        <Link to="/studies/1"><img src="/images/tmp/herman-rusty.png" className="img-fluid" alt="Herman and Rusty" /></Link>
                    </Col>
                    <Col xl={8}>
                        <Link to="/studies/1"><h3>The Ark Elementary</h3></Link>
                        <p><i>An ongoing weekly series for 1st-5th graders</i></p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam non tincidunt ante. Cras tortor ipsum, lacinia nec lorem in, lobortis pulvinar risus. Aenean mollis mauris quis ullamcorper placerat. Vestibulum dictum fringilla libero ac faucibus. Sed sollicitudin felis sed fermentum egestas. In et magna consequat, aliquam sapien venenatis, mollis arcu. Nullam fringilla diam non elit luctus, vel tristique metus ultrices. Integer finibus vulputate lectus, ut vestibulum est euismod a. Pellentesque commodo dui et consequat vestibulum. Curabitur non faucibus magna. Praesent laoreet porttitor consequat.</p>
                    </Col>
                </Row>
                <hr />

                <h3>High Voltage Kids</h3>
                <Row>
                    <Col xl={4}>
                        <img src="/images/tmp/family-mechanics.png" className="img-fluid" alt="Family Mechanics" />
                    </Col>
                    <Col xl={8}>
                        <h3>Family Mechanics</h3>
                        <p><i>A 8 week series for 1st-5th graders</i></p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam non tincidunt ante. Cras tortor ipsum, lacinia nec lorem in, lobortis pulvinar risus. Aenean mollis mauris quis ullamcorper placerat. Vestibulum dictum fringilla libero ac faucibus. Sed sollicitudin felis sed fermentum egestas. In et magna consequat, aliquam sapien venenatis, mollis arcu. Nullam fringilla diam non elit luctus, vel tristique metus ultrices. Integer finibus vulputate lectus, ut vestibulum est euismod a. Pellentesque commodo dui et consequat vestibulum. Curabitur non faucibus magna. Praesent laoreet porttitor consequat.</p>
                    </Col>
                </Row>
                <hr />

                <Row>
                    <Col xl={4}>
                        <img src="/images/tmp/deal-or-no-deal.png" className="img-fluid" alt="Deal or no Deal" />
                    </Col>
                    <Col xl={8}>
                        <h3>Deal or No Deal</h3>
                        <p><i>A 8 week series for 1st-5th graders</i></p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam non tincidunt ante. Cras tortor ipsum, lacinia nec lorem in, lobortis pulvinar risus. Aenean mollis mauris quis ullamcorper placerat. Vestibulum dictum fringilla libero ac faucibus. Sed sollicitudin felis sed fermentum egestas. In et magna consequat, aliquam sapien venenatis, mollis arcu. Nullam fringilla diam non elit luctus, vel tristique metus ultrices. Integer finibus vulputate lectus, ut vestibulum est euismod a. Pellentesque commodo dui et consequat vestibulum. Curabitur non faucibus magna. Praesent laoreet porttitor consequat.</p>
                    </Col>
                </Row>




            </Container>
        </div>
    </>);
}
