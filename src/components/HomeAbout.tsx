import { Button, Col, Container, Row } from "react-bootstrap";

export function HomeAbout() {

  return (
    <div className="homeSection alt" id="aboutSection">
      <Container>
        <Row>
          <Col lg={{ span: 10, offset: 1 }} className="text-center">
            <div className="title">
              <span>Who we are</span>
            </div>
            <h2>About Lessons.church</h2>
            <p className="lead">
              Lessons.church is a completely free service provided to
              Christian churches and ministries.
            </p>
            <p>
              Every year the Church as a whole spends{" "}
              <b>millions of dollars</b> purchasing curriculum for classrooms.
              We believe by the body working together to create and distribute
              freely available curriculum, that money can be freed up for use
              in other areas. Likewise, we do not believe that budget
              restrictions should prevent teachers from doing the best job
              they possibly can. That is why we developed Lessons.church; a
              completely free, open-source platform for finding and managing
              curriculum.
            </p>
            <p>
              Lessons.church is built and provided free of charge by{" "}
              <a href="https://livecs.org/">Live Church Solutions</a>, a
              501(c)(3) that was founded in 2012 with the goal of helping
              small churches with their technical needs.
            </p>
            <Button variant="light" href="https://livecs.org/">
              Learn More
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
