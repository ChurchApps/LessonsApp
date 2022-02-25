import { Button, Col, Container, Row } from "react-bootstrap";

export function HomeConnect() {

  return (
    <div className="homeSection alt" id="connectSection">
      <Container>
        <Row>
          <Col lg={{ span: 10, offset: 1 }} className="text-center">
            <div className="title">
              <span>Our Apps</span>
            </div>
            <h2>Using in Your Classroom</h2>
            <Row>
              <Col md={5} style={{ textAlign: "left" }}>
                <p>
                  Great curriculum can make your teaching far more effective, but only if you can reliably deliver it each week.
                  See the video to learn how you can easily present your lessons from a Fire stick each week, even if the Internet goes down.
                </p>
                <p>In addition your volunteers can use the B1.church app to see the leaders notes each week.  There is nothing to print.</p>
                <p>View <a href="http://support.churchapps.org/lessons/setup.html" target="_blank" rel="noreferrer">our guide</a> on setting up schedules to configure your church.</p>
              </Col>
              <Col md={7}>
                <div className="videoWrapper">
                  <iframe
                    width="992"
                    height="558"
                    src={"https://www.youtube.com/embed/cOep9hdBey4"}
                    title="Lessons.church App"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col>
                <div className="d-grid gap-2">
                  <Button size="lg" variant="success" href="https://play.google.com/store/apps/details?id=church.b1.mobile" target="_blank">Get B1.church App for Volunteers</Button>
                </div>
              </Col>
              <Col>
                <div className="d-grid gap-2">
                  <Button size="lg" variant="primary" href="https://www.amazon.com/dp/B09T38BNQG/" target="_blank">Get Lessons.church App for TVs</Button>
                </div>
              </Col>
            </Row>


          </Col>
        </Row>
      </Container>
    </div>
  );
}
