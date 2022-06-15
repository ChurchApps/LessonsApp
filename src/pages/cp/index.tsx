import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ClassroomList, ScheduleList, } from "@/components";
import { PlaylistFeed } from "@/components/cp/PlaylistFeed";
import { ApiHelper } from "@/utils";
import { Wrapper } from "@/components/Wrapper";
import { Grid } from "@mui/material";

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
    <Wrapper>
      <h1>Manage Classroom Schedules</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          {getScheduleSection()}
        </Grid>
        <Grid item md={4} xs={12}>
          {getPlaylistFeed()}
          <ClassroomList classroomSelected={setClassroomId} showFeed={handleShowFeed} />
        </Grid>
      </Grid>
    </Wrapper>
  );
}
