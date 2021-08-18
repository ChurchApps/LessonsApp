import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Container } from "react-bootstrap";
import { Layout, ClassroomList, ScheduleList, } from "@/components";
import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  const router = useRouter();
  const { loggedIn } = useAuth();
  const [classroomId, setClassroomId] = useState("");

  useEffect(() => {
    if (!loggedIn) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getScheduleSection = () => {
    if (classroomId === "") return <p>Select or add a classroom to manage schedules.</p>
    else return <ScheduleList classroomId={classroomId} />
  }


  return (
    <Layout>
      <Container>
        <h1>Manage Classroom Schedules</h1>
        <Row>
          <Col lg={8}>
            {getScheduleSection()}
          </Col>
          <Col lg={4}>
            <ClassroomList classroomSelected={setClassroomId} />

          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
