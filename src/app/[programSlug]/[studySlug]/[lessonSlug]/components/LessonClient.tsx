"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Container, Grid } from "@mui/material";
import { ErrorBoundary, Layout } from "@/components";
import { Header } from "@/components/Header";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import { Venue } from "@/components/lesson/Venue";
import { FeedVenueInterface } from "@/helpers/interfaces";
import { PresenterLink } from "./PresenterLink";

interface Props {
  lessonData: any;
}

export default function LessonClient(props: Props) {
  const [selectedVenue, setSelectedVenue] = React.useState<FeedVenueInterface>(props.lessonData?.venues?.[0]);
  const [print, setPrint] = React.useState<number>(0);

  const handleVenueChange = React.useCallback((v: FeedVenueInterface) => {
    setSelectedVenue(v);
  }, []);

  const handlePrint = React.useCallback(() => {
    setPrint(Math.random());
  }, []);

  return (
    <Layout withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <div className="breadcrumb">
                  <Link href={"/" + selectedVenue.programSlug}>{selectedVenue.programName}</Link>:{" "}
                  <Link href={"/" + selectedVenue.programSlug + "/" + selectedVenue.studySlug}>
                    {selectedVenue.studyName}
                  </Link>
                </div>
                <h1>{selectedVenue.lessonName}</h1>
                {selectedVenue.lessonDescription && (
                  <div style={{ marginBottom: 20 }}>{selectedVenue.lessonDescription}</div>
                )}
                <PresenterLink selectedVenue={selectedVenue} />
              </Grid>
            </Grid>

            <div style={{ height: 50 }}></div>
            <Image
              src={selectedVenue.lessonImage || "/not-found"}
              alt={selectedVenue.lessonName}
              width={320}
              height={180}
              className="badge"
            />
          </Container>
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }} style={{ backgroundColor: "#FFF" }}>
          <LessonSidebar
            venues={props.lessonData?.venues}
            selectedVenue={selectedVenue}
            onVenueChange={handleVenueChange}
            onPrint={handlePrint}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Container>
            <div style={{ marginTop: 60 }}>
              <ErrorBoundary>
                <Venue useAccordion={false} venue={selectedVenue} print={print} />
              </ErrorBoundary>
            </div>
          </Container>
        </Grid>
      </Grid>
    </Layout>
  );
}
