"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ApiHelper } from "@churchapps/apphelper";
import { Container, Box, Typography, Card, CardContent, CardHeader } from "@mui/material";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import type { AddOnInterface, ExternalVideoInterface, FileInterface } from "@/helpers/interfaces";

interface AddOnResponse extends AddOnInterface {
  video?: ExternalVideoInterface;
  file?: FileInterface;
  seconds?: number;
}

type PageParams = { id: string };

export default function EmbedAddOn() {
  const params = useParams<PageParams>();
  const [addOn, setAddOn] = useState<AddOnResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      EnvironmentHelper.init();
      try {
        const result: AddOnResponse = await ApiHelper.getAnonymous(
          "/addOns/public/" + params.id,
          "LessonsApi"
        );
        setAddOn(result);
      } catch (error) {
        console.error("Error loading add-on:", error);
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
      window.parent.postMessage({ type: "lessonAddOnHeight", height }, "*");
    };

    // Send initial height and on resize
    sendHeight();
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, [addOn]);

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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderContent = () => {
    if (addOn.addOnType === "externalVideo" && addOn.video) {
      // Render Vimeo player
      const videoId = addOn.video.videoId;
      return (
        <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=0&loop=${addOn.video.loopVideo ? 1 : 0}`}
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
    } else if (addOn.addOnType === "file" && addOn.file) {
      // Render file content based on file type
      const fileType = addOn.file.fileType || "";
      const fileUrl = addOn.file.contentPath;

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
              <source src={fileUrl} type={fileType} />
              Your browser does not support the video tag.
            </video>
          </Box>
        );
      } else if (fileType.startsWith("image/")) {
        return (
          <Box sx={{ textAlign: "center" }}>
            <img
              src={fileUrl}
              alt={addOn.name}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        );
      } else {
        return (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                Download {addOn.file.fileName}
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
              "& .MuiCardHeader-subheader": {
                color: "rgba(255,255,255,0.8)"
              }
            }}
          />
          <CardContent sx={{ p: 0 }}>
            {renderContent()}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
