import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Container } from "react-bootstrap";
import { Layout, DisplayBox, Loading, ProgramEdit, StudyEdit, LessonEdit, VenueList, ResourceList, ClassroomList, } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { ApiHelper, LessonInterface, ProgramInterface, StudyInterface, ArrayHelper } from "@/utils";

export default function Admin() {
  const router = useRouter();
  const { loggedIn } = useAuth();

  useEffect(() => {
    if (!loggedIn) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loggedIn) {
      loadData();
    }
  }, [loggedIn]);

  function loadData() {

  }

  return (
    <Layout>
      <Container>
        <h1>Classrooms</h1>
        <Row>
          <Col lg={8}>

            <DisplayBox headerText="Schedule" headerIcon="none"  >
              table goes here
            </DisplayBox>

          </Col>
          <Col lg={4}>
            <ClassroomList />

          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
