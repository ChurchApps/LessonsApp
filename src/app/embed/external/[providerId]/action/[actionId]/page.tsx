"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ApiHelper } from "@churchapps/apphelper";
import { Container, Box, Typography, Card, CardContent, CardHeader } from "@mui/material";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import { Action } from "@/components/lesson/Action";
import type { FeedActionInterface } from "@/helpers/interfaces";

interface ExternalSectionData {
  id: string;
  name: string;
  actions?: (FeedActionInterface & { id?: string })[];
}

interface ExternalVenueData {
  lessonId?: string;
  lessonName?: string;
  venueName?: string;
  sectionName?: string;
}

type PageParams = { providerId: string; actionId: string };

export default function EmbedExternalAction() {
  const params = useParams<PageParams>();
  const [action, setAction] = useState<(FeedActionInterface & { id?: string }) | null>(null);
  const [venueData, setVenueData] = useState<ExternalVenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      EnvironmentHelper.init();
      try {
        // First get the provider to find the venue
        const provider = await ApiHelper.getAnonymous(
          "/externalProviders/" + params.providerId + "/lessons",
          "LessonsApi"
        );

        // Find the action by searching through all venues in the provider's data
        let foundAction: (FeedActionInterface & { id?: string }) | null = null;
        let foundVenueData: ExternalVenueData | null = null;

        // Search through programs -> studies -> lessons -> venues -> sections -> actions
        for (const program of provider?.programs || []) {
          for (const study of program?.studies || []) {
            for (const lesson of study?.lessons || []) {
              for (const venue of lesson?.venues || []) {
                if (venue?.apiUrl) {
                  try {
                    const venueResponse = await fetch(venue.apiUrl);
                    const data = await venueResponse.json();
                    for (const section of data?.sections || []) {
                      const action = section.actions?.find((a: FeedActionInterface & { id?: string }) => a.id === params.actionId);
                      if (action) {
                        foundAction = action;
                        foundVenueData = {
                          lessonId: lesson.id,
                          lessonName: lesson.name,
                          venueName: venue.name,
                          sectionName: section.name
                        };
                        break;
                      }
                    }
                    if (foundAction) break;
                  } catch (e) {
                    console.error("Error loading venue:", e);
                  }
                }
              }
              if (foundAction) break;
            }
            if (foundAction) break;
          }
          if (foundAction) break;
        }

        setAction(foundAction);
        setVenueData(foundVenueData);
      } catch (error) {
        console.error("Error loading external action:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.providerId, params.actionId]);

  useEffect(() => {
    // Send height to parent window for iframe resizing
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "lessonActionHeight", height }, "*");
    };

    sendHeight();
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, [action]);

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case "say": return "Say";
      case "do": return "Do";
      case "note": return "Note";
      case "play": return "Play";
      default: return actionType;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!action) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Action not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Card className="actionCard" sx={{ mb: 2 }}>
          <CardHeader
            title={action.content?.substring(0, 50) + (action.content && action.content.length > 50 ? "..." : "") || getActionTypeLabel(action.actionType)}
            subheader={
              <>
                <b>{getActionTypeLabel(action.actionType)}</b>
              </>
            }
            sx={{
              backgroundColor: "#28235d",
              color: "#fff",
              "& .MuiCardHeader-subheader": {
                color: "rgba(255,255,255,0.8)"
              }
            }}
          />
          <CardContent>
            <Box className="b1">
              <Action action={action} lessonId={venueData?.lessonId || ""} />
            </Box>
          </CardContent>
        </Card>

        {venueData && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
            {venueData.lessonName} &gt; {venueData.venueName} &gt; {venueData.sectionName}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
