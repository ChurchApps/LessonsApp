"use client";

import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import { VideoModal } from "@/components/VideoModal";
import { ProgramInterface } from "@/helpers/interfaces";
import { Icon } from "@mui/material";
import { useState } from "react";

interface Props {
  program: ProgramInterface;
}

export function ProgramVideo(props: Props) {
  const [showVideo, setShowVideo] = useState(false);

  const video = props.program.videoEmbedUrl && (<EmbeddedVideo videoEmbedUrl={props.program.videoEmbedUrl} title={props.program.name} />);

  return <>
    {video && <a href="about:blank" onClick={(e) => { e.preventDefault(); setShowVideo(true); }} className="cta"><Icon style={{float:"left", marginRight:10}}>play_circle</Icon>Watch Trailer</a>}
    {showVideo && <VideoModal onClose={() => setShowVideo(false)} url={props.program.videoEmbedUrl} />}
  </>
}
