import Head from "next/head";
import { GetStaticProps } from "next";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Layout, Programs } from "@/components";
import { ApiHelper, ProgramInterface, ProviderInterface } from "@/utils";

type Props = {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
};

export default function Home({ programs, providers }: Props) {
  return (
    <Layout>
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
      <Programs programs={programs} providers={providers} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const programs: ProgramInterface[] = await ApiHelper.getAnonymous(
    "/programs/public",
    "LessonsApi"
  );
  const providers: ProviderInterface[] = await ApiHelper.getAnonymous(
    "/providers/public",
    "LessonsApi"
  );

  return {
    props: {
      programs,
      providers,
    },
    revalidate: 30,
  };
};