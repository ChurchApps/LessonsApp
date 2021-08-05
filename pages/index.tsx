import Head from "next/head";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Layout } from "@components/index";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Lessons.church - Free Church Curriculum</title>
      </Head>
      <div id="hero">
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} className="text-center">
              <h1>
                Completely <span>Free Curriculum</span> for Churches
              </h1>
              <p>
                We believe that limited church budgets should never stand in the
                way of teaching both children and adults the word of God in the
                most effective way possible. By partnering with generous
                creators willing to donate their work for other churches to use
                we are able to provide this content for your church completely
                free of charge.
              </p>
              <div>
                <Button variant="success" size="lg" href="#register">
                  Get Started for Free
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
}
