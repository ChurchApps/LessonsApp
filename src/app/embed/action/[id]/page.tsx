"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ApiHelper } from "@churchapps/apphelper";
import { Container, Box, Typography, Card, CardContent, CardHeader } from "@mui/material";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import { Action } from "@/components/lesson/Action";
import type { FeedActionInterface } from "@/helpers/interfaces";

interface ActionFeedResponse {
  action: FeedActionInterface & { id?: string };
  sectionId: string;
  sectionName: string;
  lessonId: string;
  lessonName: string;
  lessonDescription: string;
  lessonImage: string;
  venueName: string;
  studyName: string;
  programName: string;
  roleName: string;
}

type PageParams = { id: string };

export default function EmbedAction() {
  const params = useParams<PageParams>();
  const [data, setData] = useState<ActionFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      EnvironmentHelper.init();
      try {
        const result: ActionFeedResponse = await ApiHelper.getAnonymous(
          "/actions/public/feed/" + params.id,
          "LessonsApi"
        );
        setData(result);
      } catch (error) {
        console.error("Error loading action:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  useEffect(() => {
    // Send height to parent window for iframe resizing
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "lessonActionHeight", height }, "*");
    };

    // Send initial height and on resize
    sendHeight();
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, [data]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!data?.action) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Action not found</Typography>
      </Box>
    );
  }

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case "say": return "Say";
      case "do": return "Do";
      case "note": return "Note";
      case "play": return "Play";
      default: return actionType;
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Card className="actionCard" sx={{ mb: 2 }}>
          <CardHeader
            title={data.action.content?.substring(0, 50) + (data.action.content?.length > 50 ? "..." : "") || getActionTypeLabel(data.action.actionType)}
            subheader={
              <>
                <b>{getActionTypeLabel(data.action.actionType)}</b>
                {data.roleName && <> - {data.roleName}</>}
              </>
            }
            sx={{
              backgroundColor: "#28235d",
              color: "#fff",
              "& .MuiCardHeader-subheader": { color: "rgba(255,255,255,0.8)" }
            }}
          />
          <CardContent>
            <Box className="b1">
              <Action action={data.action} lessonId={data.lessonId} />
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
          {data.programName} &gt; {data.studyName} &gt; {data.lessonName} &gt; {data.venueName} &gt; {data.sectionName}
        </Typography>
      </Container>
    </Box>
  );
}
