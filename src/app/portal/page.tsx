"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { School as SchoolIcon } from "@mui/icons-material";
import { Box, Grid, Paper } from "@mui/material";
import { ClassroomList, HomeConnect, ScheduleList } from "@/components";
import { Wrapper } from "@/components/Wrapper";
import { PageHeader } from "@churchapps/apphelper";
import { PlaylistFeed } from "@/components/portal/PlaylistFeed";
import { ApiHelper } from "@/helpers";

export default function CP() {
  const { isAuthenticated } = ApiHelper;
  const [classroomId, setClassroomId] = useState("");
  const [feedClassroomId, setFeedClassroomId] = useState("");

  useEffect(() => {
    if (!isAuthenticated) redirect("/login");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowFeed = (classroomId: string) => {
    setFeedClassroomId(classroomId);
  };

  const getScheduleSection = () => {
    if (classroomId === "") {
      let html = '<lite-vimeo videoid="985348183" videotitle="Setup Instructions"></lite-vimeo>';
      return (
        <>
          <div>
            <div
              style={{ maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}
              dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>
        </>
      );
    } else {
      return <ScheduleList classroomId={classroomId} />;
    }
  };

  const getPlaylistFeed = () => {
    if (feedClassroomId) {
      return (
        <PlaylistFeed
          classroomId={feedClassroomId}
          hideFeed={() => {
            setFeedClassroomId("");
          }}
        />
      );
    }
  };

  return (
    <Wrapper>
      <Box sx={{ p: 0 }}>
        <PageHeader
          icon={<SchoolIcon />}
          title="Classroom Management"
          subtitle="Schedule lessons and manage classroom content"
        />

        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "0 0 8px 8px",
            minHeight: "calc(100vh - 200px)"
          }}>
          {getPlaylistFeed()}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              {getScheduleSection()}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <ClassroomList classroomSelected={setClassroomId} showFeed={handleShowFeed} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <HomeConnect />
          </Box>
        </Paper>
      </Box>
    </Wrapper>
  );
}
