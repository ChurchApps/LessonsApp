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
  materials?: string;
  actions?: (FeedActionInterface & { id?: string })[];
}

interface ExternalVenueData {
  lessonId?: string;
  lessonName?: string;
  venueName?: string;
  sections?: ExternalSectionData[];
}

type PageParams = { providerId: string; sectionId: string };

export default function EmbedExternalSection() {
  const params = useParams<PageParams>();
  const [section, setSection] = useState<ExternalSectionData | null>(null);
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

        // Find the section by searching through all venues in the provider's data
        let foundSection: ExternalSectionData | null = null;
        let foundVenueData: ExternalVenueData | null = null;

        // Search through programs -> studies -> lessons -> venues
        for (const program of provider?.programs || []) {
          for (const study of program?.studies || []) {
            for (const lesson of study?.lessons || []) {
              for (const venue of lesson?.venues || []) {
                if (venue?.apiUrl) {
                  try {
                    const venueResponse = await fetch(venue.apiUrl);
                    const data = await venueResponse.json();
                    const section = data?.sections?.find((s: ExternalSectionData) => s.id === params.sectionId);
                    if (section) {
                      foundSection = section;
                      foundVenueData = {
                        lessonId: lesson.id,
                        lessonName: lesson.name,
                        venueName: venue.name,
                        sections: data.sections
                      };
                      break;
                    }
                  } catch (e) {
                    console.error("Error loading venue:", e);
                  }
                }
              }
              if (foundSection) break;
            }
            if (foundSection) break;
          }
          if (foundSection) break;
        }

        setSection(foundSection);
        setVenueData(foundVenueData);
      } catch (error) {
        console.error("Error loading external section:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.providerId, params.sectionId]);

  useEffect(() => {
    // Send height to parent window for iframe resizing
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "lessonSectionHeight", height }, "*");
    };

    sendHeight();
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, [section]);

  const getActions = () => {
    if (!section?.actions) return null;
    return section.actions.map((action: FeedActionInterface & { id?: string }) => (
      <Action action={action} lessonId={venueData?.lessonId || ""} key={action.id} />
    ));
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!section) {
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
            title={section.name}
            subheader={
              section.materials && (
                <>
                  <b>Materials:</b> {section.materials}
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

        {venueData && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
            {venueData.lessonName} &gt; {venueData.venueName}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
