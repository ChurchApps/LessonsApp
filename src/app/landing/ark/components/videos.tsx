"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { VideoModal } from "@/components/VideoModal";

export function Videos() {
  const [vimeoPreviewId, setVimeoPreviewId] = useState<string>(null);

  return (
    <>
      <Container fixed style={{ paddingTop: 40, paddingBottom: 40 }}>
        <Grid container spacing={2}>
          <Grid size={{ md: 4, xs: 12 }}>
            <a
              href="about:blank"
              onClick={e => {
                e.preventDefault();
                setVimeoPreviewId("750138454");
              }}>
              <img src="/images/landing/ark-video-1.png" alt="Ark Kids Junior" className="img-fluid" />
            </a>
          </Grid>
          <Grid size={{ md: 4, xs: 12 }}>
            <a
              href="about:blank"
              onClick={e => {
                e.preventDefault();
                setVimeoPreviewId("754251052");
              }}>
              <img src="/images/landing/ark-video-2.png" alt="Ark Kids" className="img-fluid" />
            </a>
          </Grid>
          <Grid size={{ md: 4, xs: 12 }}>
            <a
              href="about:blank"
              onClick={e => {
                e.preventDefault();
                setVimeoPreviewId("750131877");
              }}>
              <img src="/images/landing/ark-video-3.png" alt="Ark Kids" className="img-fluid" />
            </a>
          </Grid>
        </Grid>
      </Container>
      {vimeoPreviewId && (
        <VideoModal onClose={() => setVimeoPreviewId(null)} url={"https://vimeo.com/" + vimeoPreviewId} />
      )}
    </>
  );
}
