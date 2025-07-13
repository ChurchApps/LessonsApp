"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { DateHelper } from "@churchapps/apphelper/dist/helpers/DateHelper";
import { Layout } from "@/components/Layout";
import { Venue } from "@/components/lesson/Venue";
import {
  ClassroomInterface,
  CustomizationInterface,
  FeedVenueInterface,
  ScheduleInterface
} from "@/helpers/interfaces";

interface Props {
  classroom: ClassroomInterface;
  customizations: CustomizationInterface[];
  currentSchedule: ScheduleInterface;
  prevSchedule: ScheduleInterface;
  nextSchedule: ScheduleInterface;
  venue: FeedVenueInterface;
  autoPrint: boolean;
}

export function VenueClient(props: Props) {
  const [selectedTab, setSelectedTab] = useState<string>("");

  const getVenue = () => {
    if (props.venue) {
      return (
        <Venue
          useAccordion={true}
          venue={props.venue}
          hidePrint={false}
          print={props.autoPrint ? 1 : 0}
          customizations={props.customizations}
        />
      );
    }
  };

  const getTabs = () => {
    const result: JSX.Element[] = [];
    props.venue?.sections?.forEach(s => {
      if (s.actions?.length > 0) result.push(<Tab label={s.name} value={s.name} />);
    });
    if (result.length === 0) {
      return <></>;
    } else {
      return (
        <Tabs
          value={selectedTab}
          onChange={(e, newVal) => {
            handleChange(newVal);
          }}
          variant="scrollable"
          scrollButtons="auto">
          {result}
        </Tabs>
      );
    }
  };

  const handleChange = (newValue: string) => {
    setSelectedTab(newValue);
    const scrollTop = document.getElementById("section-" + newValue).offsetTop - 50;
    window.scrollTo({ top: scrollTop, behavior: "smooth" });
  };

  const handleHighlight = () => {
    const elements = document.getElementsByClassName("sectionCard");
    let maxTop = 0;
    let result = "";
    for (let i = 0; i < elements.length; i++) {
      const el: any = elements[i];
      if (window.scrollY >= el.offsetTop - 60 && el.offsetTop > 0) {
        if (el.offsetTop > maxTop) {
          maxTop = el.offsetTop;
          result = el.id.replace("section-", "");
        }
      }
    }

    if (result !== selectedTab) setSelectedTab(result);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleHighlight);

    return () => {
      window.removeEventListener("scroll", handleHighlight);
    };
  }, []);

  if (props.venue === null) {
    return <></>;
  } else {
    return (
      <Layout withoutNavbar={true} withoutFooter={true}>
        <div id="b1Tabs">{getTabs()}</div>
        <div style={{ height: 50 }}></div>
        <Link href={"/b1/" + props.classroom?.churchId}>Go back</Link>
        <Grid container columnSpacing={2}>
          <Grid item xs={4}>
            {props.prevSchedule && (
              <Link href={"/b1/venue/" + props.prevSchedule?.venueId + "?classroomId=" + props.classroom?.id}>
                {DateHelper.prettyDate(DateHelper.toDate(props.prevSchedule.scheduledDate))}
              </Link>
            )}
          </Grid>
          <Grid item xs={4} style={{ textAlign: "center" }}>
            {props.currentSchedule && (
              <b>{DateHelper.prettyDate(DateHelper.toDate(props.currentSchedule.scheduledDate))}</b>
            )}
          </Grid>
          <Grid item xs={4} style={{ textAlign: "right" }}>
            {props.nextSchedule && (
              <Link href={"/b1/venue/" + props.nextSchedule?.venueId + "?classroomId=" + props.classroom?.id}>
                {DateHelper.prettyDate(DateHelper.toDate(props.nextSchedule.scheduledDate))}
              </Link>
            )}
          </Grid>
        </Grid>

        <Container fixed>
          <h1>{props.venue?.lessonName}</h1>
        </Container>
        <div className="b1">{getVenue()}</div>
        <br />
      </Layout>
    );
  }
}
