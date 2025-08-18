"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FeedActionInterface, FeedFileInterface } from "@/helpers";

interface ActionPreviewProps {
  action: FeedActionInterface;
  actionId: string;
}

export function ActionPreview({ action }: ActionPreviewProps) {
  const [error, setError] = useState<string | null>(null);

  if (action.actionType !== "play") {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "Arial, sans-serif"
      }}>
        Only "play" actions can be previewed
      </div>
    );
  }

  const file = action.files?.[0];
  if (!file) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "Arial, sans-serif"
      }}>
        No media file found for this action
      </div>
    );
  }

  const renderMedia = (file: FeedFileInterface) => {
    const { url, streamUrl, thumbnail, fileType, loop = false } = file;

    // Handle Vimeo videos
    if (url?.includes("vimeo.com")) {
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      const videoId = vimeoMatch?.[1];

      if (videoId) {
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=1${loop ? "&loop=1" : ""}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        );
      }
    }

    // Handle YouTube videos
    if (url?.includes("youtube.com") || url?.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || "";
      }

      if (videoId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1${loop ? "&loop=1&playlist=" + videoId : ""}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        );
      }
    }

    // Determine if it's a video file
    const isVideo = fileType?.startsWith("video/") ||
                   url?.includes(".mp4") ||
                   url?.includes(".webm") ||
                   url?.includes(".mov") ||
                   streamUrl;

    if (isVideo) {
      const videoUrl = streamUrl || url;
      if (!videoUrl) return null;

      return (
        <video
          controls
          autoPlay
          loop={loop}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
          poster={thumbnail}
          onError={() => setError("Failed to load video")}
        >
          <source src={videoUrl} type={fileType || "video/mp4"} />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Handle images
    const imageUrl = thumbnail || url;
    if (!imageUrl) return null;

    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
      }}>
        <Image
          src={imageUrl}
          alt={action.content || "Preview"}
          fill
          style={{
            objectFit: "contain"
          }}
          onError={() => setError("Failed to load image")}
        />
      </div>
    );
  };

  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "Arial, sans-serif"
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      backgroundColor: "#000",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden"
    }}>
      {renderMedia(file)}
    </div>
  );
}
