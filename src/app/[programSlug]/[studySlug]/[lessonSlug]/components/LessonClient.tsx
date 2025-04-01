"use client";

import { Grid, Container } from "@mui/material";
import { Layout, Venue } from "@/components";
import { FeedVenueInterface } from "@/helpers/interfaces";
import Image from "next/image";
import { Header } from "@/components/Header";
import Link from "next/link";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import React from "react";
import { PresenterLink } from "./PresenterLink";

type Props = {
  lessonData: any;
};


export default function LessonClient(props: Props) {

  const [selectedVenue, setSelectedVenue] = React.useState<FeedVenueInterface>(props.lessonData?.venues?.[0]);
  const [print, setPrint] = React.useState<number>(0);


  return (
    <Layout withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <Grid container spacing={2}>
              <Grid item md={7} xs={12}>
                <div className="breadcrumb"><Link href={"/" + selectedVenue.programSlug}>{selectedVenue.programName}</Link>: <Link href={"/" + selectedVenue.programSlug + "/" + selectedVenue.studySlug }>{selectedVenue.studyName}</Link></div>
                <h1>{selectedVenue.lessonName}</h1>
                {selectedVenue.lessonDescription && <div style={{marginBottom:20}}>{selectedVenue.lessonDescription}</div>}
                <PresenterLink selectedVenue={selectedVenue} />
              </Grid>
            </Grid>

            <div style={{height:50}}></div>
            <Image src={selectedVenue.lessonImage || "/not-found"} alt={selectedVenue.lessonName} width={320} height={180} className="badge" />
          </Container>
        </div>
      </div>


      <Grid container spacing={2}>
        <Grid item md={3} sm={12} style={{backgroundColor:"#FFF"}}>
          <LessonSidebar venues={props.lessonData?.venues} selectedVenue={selectedVenue} onVenueChange={(v) => { setSelectedVenue(v); }} onPrint={() => { setPrint(Math.random()) } } />
        </Grid>
        <Grid item md={9} sm={12}>
          <Container>
            <div style={{marginTop:60}}>
              <Venue useAccordion={false} venue={selectedVenue} print={print} />
            </div>
          </Container>
        </Grid>
      </Grid>



    </Layout>
  );
}
