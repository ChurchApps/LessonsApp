import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Container } from "react-bootstrap";
import { Layout, ClassroomList, ScheduleList, } from "@/components";
import { PlaylistFeed } from "@/components/cp/PlaylistFeed";
import { ApiHelper } from "@/utils";

export default function CP() {
  const router = useRouter();
  const { isAuthenticated } = ApiHelper;
  const [classroomId, setClassroomId] = useState("");
  const [feedClassroomId, setFeedClassroomId] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowFeed = (classroomId: string) => {
    setFeedClassroomId(classroomId);
  }

  const getScheduleSection = () => {
    if (classroomId === "") return <p>Select or add a classroom to manage schedules.</p>
    else return <ScheduleList classroomId={classroomId} />
  }

  const getPlaylistFeed = () => {
    if (feedClassroomId) return <PlaylistFeed classroomId={feedClassroomId} hideFeed={() => { setFeedClassroomId("") }} />
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
            {getPlaylistFeed()}
            <ClassroomList classroomSelected={setClassroomId} showFeed={handleShowFeed} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
