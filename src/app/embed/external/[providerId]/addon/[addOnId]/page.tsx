"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ApiHelper } from "@churchapps/apphelper";
import { Container, Box, Typography, Card, CardContent, CardHeader } from "@mui/material";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";

interface ExternalAddOnData {
  id: string;
  name: string;
  category?: string;
  addOnType?: string;
  videoId?: string;
  loopVideo?: boolean;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  seconds?: number;
}

interface ExternalVenueData {
  lessonId?: string;
  lessonName?: string;
  venueName?: string;
}

type PageParams = { providerId: string; addOnId: string };

export default function EmbedExternalAddOn() {
  const params = useParams<PageParams>();
  const [addOn, setAddOn] = useState<ExternalAddOnData | null>(null);
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

        // Find the add-on by searching through all venues in the provider's data
        let foundAddOn: ExternalAddOnData | null = null;
        let foundVenueData: ExternalVenueData | null = null;

        // Search through programs -> studies -> lessons -> venues -> addOns
        for (const program of provider?.programs || []) {
          for (const study of program?.studies || []) {
            for (const lesson of study?.lessons || []) {
              for (const venue of lesson?.venues || []) {
                if (venue?.apiUrl) {
                  try {
                    const venueResponse = await fetch(venue.apiUrl);
                    const data = await venueResponse.json();
                    const addOn = data?.addOns?.find((a: ExternalAddOnData) => a.id === params.addOnId);
                    if (addOn) {
                      foundAddOn = addOn;
                      foundVenueData = {
                        lessonId: lesson.id,
                        lessonName: lesson.name,
                        venueName: venue.name
                      };
                      break;
                    }
                  } catch (e) {
                    console.error("Error loading venue:", e);
                  }
                }
              }
              if (foundAddOn) break;
            }
            if (foundAddOn) break;
          }
          if (foundAddOn) break;
        }

        setAddOn(foundAddOn);
        setVenueData(foundVenueData);
      } catch (error) {
        console.error("Error loading external add-on:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.providerId, params.addOnId]);

  useEffect(() => {
    // Send height to parent window for iframe resizing
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "lessonAddOnHeight", height }, "*");
    };

    sendHeight();
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, [addOn]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderContent = () => {
    if (addOn?.addOnType === "externalVideo" && addOn.videoId) {
      return (
        <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
          <iframe
            src={`https://player.vimeo.com/video/${addOn.videoId}?autoplay=0&loop=${addOn.loopVideo ? 1 : 0}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none"
            }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={addOn.name}
          />
        </Box>
      );
    } else if (addOn?.addOnType === "file" && addOn.fileUrl) {
      const fileType = addOn.fileType || "";

      if (fileType.startsWith("video/")) {
        return (
          <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
            <video
              controls
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
              }}
            >
              <source src={addOn.fileUrl} type={fileType} />
              Your browser does not support the video tag.
            </video>
          </Box>
        );
      } else if (fileType.startsWith("image/")) {
        return (
          <Box sx={{ textAlign: "center" }}>
            <img
              src={addOn.fileUrl}
              alt={addOn.name}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        );
      } else {
        return (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography>
              <a href={addOn.fileUrl} target="_blank" rel="noopener noreferrer">
                Download {addOn.fileName || "file"}
              </a>
            </Typography>
          </Box>
        );
      }
    }

    return (
      <Box sx={{ textAlign: "center", p: 3 }}>
        <Typography color="text.secondary">No content available</Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!addOn) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Add-on not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Card sx={{ mb: 2 }}>
          <CardHeader
            title={addOn.name}
            subheader={
              <>
                <b>{addOn.category}</b>
                {addOn.seconds && addOn.seconds > 0 && (
                  <> - {formatDuration(addOn.seconds)}</>
                )}
              </>
            }
            sx={{
              backgroundColor: "#28235d",
              color: "#fff",
              "& .MuiCardHeader-subheader": { color: "rgba(255,255,255,0.8)" }
            }}
          />
          <CardContent sx={{ p: 0 }}>
            {renderContent()}
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
