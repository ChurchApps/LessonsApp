"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ApiHelper } from "@churchapps/apphelper";
import { Container, Box, Typography, Card, CardContent, CardHeader } from "@mui/material";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import { Action } from "@/components/lesson/Action";
import type { FeedSectionInterface, FeedActionInterface } from "@/helpers/interfaces";

interface SectionFeedResponse {
  section: FeedSectionInterface & { id?: string };
  lessonId: string;
  lessonName: string;
  lessonDescription: string;
  lessonImage: string;
  venueName: string;
  studyName: string;
  programName: string;
}

type PageParams = { id: string };

export default function EmbedSection() {
  const params = useParams<PageParams>();
  const [data, setData] = useState<SectionFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      EnvironmentHelper.init();
      try {
        const result: SectionFeedResponse = await ApiHelper.getAnonymous(
          "/sections/public/feed/" + params.id,
          "LessonsApi"
        );
        setData(result);
      } catch (error) {
        console.error("Error loading section:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const getActions = () => {
    if (!data?.section?.actions) return null;
    return data.section.actions.map((action: FeedActionInterface & { id?: string }) => (
      <Action action={action} lessonId={data.lessonId} key={action.id} />
    ));
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!data?.section) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Section not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Card className="sectionCard" sx={{ mb: 2 }}>
          <CardHeader
            title={data.section.name}
            subheader={
              data.section.materials && (
                <>
                  <b>Materials:</b> {data.section.materials}
                </>
              )
            }
            sx={{
              backgroundColor: "#28235d",
              color: "#fff",
              "& .MuiCardHeader-subheader": { color: "rgba(255,255,255,0.8)" }
            }}
          />
          <CardContent>
            <Box className="b1">
              {getActions()}
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
          {data.programName} &gt; {data.studyName} &gt; {data.lessonName} &gt; {data.venueName}
        </Typography>
      </Container>
    </Box>
  );
}
