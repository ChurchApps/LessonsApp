import React from "react";
import { Layout } from "@/components/Layout";
import { ClassroomInterface, ScheduleInterface } from "@/helpers/interfaces";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Link from "next/link";
import { DateHelper } from "@churchapps/apphelper/dist/helpers/DateHelper";
import { Container } from "@mui/material";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { MetaHelper } from "@/helpers/MetaHelper";

type PageParams = {id:string }

export async function generateMetadata(): Promise<Metadata> {
  return MetaHelper.getMetaData();
}

export default async function Classroom({params}: { params:Promise<PageParams> }) {

  const loadData = async () => {
    const { id } = await params;
    const classroom:ClassroomInterface = await ApiHelper.get("/classrooms/" + id, "LessonsApi")
    const schedules:ScheduleInterface[] = await ApiHelper.get("/schedules/public/classroom/" + classroom.id, "LessonsApi");
    return {classroom, schedules};
  }

  const {classroom, schedules} = await loadData();

  const getRows = () => {
    const result: JSX.Element[] = [];
    schedules?.forEach(s => {
      result.push(<Link href={"/b1/venue/" + s.venueId + "?classroomId=" + classroom?.id} className="bigLink">
        {DateHelper.getShortDate(DateHelper.convertToDate(s.scheduledDate))}
        <span>{s.displayName}</span>
      </Link>);
    });

    return result;
  }

  const checkRedirect = () => {
    if (schedules) {
      let notExpired: ScheduleInterface[] = [];
      const cutOff = new Date();
      cutOff.setDate(cutOff.getDate() - 5);
      schedules.forEach(s => { if (DateHelper.convertToDate(s.scheduledDate) >= cutOff) notExpired.push(s); });

      if (notExpired.length > 0) {
        notExpired = notExpired.sort((a, b) => {
          const dateA = DateHelper.convertToDate(a.scheduledDate);
          const dateB = DateHelper.convertToDate(b.scheduledDate);
          return (dateA < dateB) ? -1 : 1;
        });
        let redirectUrl = "/b1/venue/" + notExpired[0].venueId + "?classroomId=" + classroom?.id;
        if (notExpired[0].externalProviderId) redirectUrl += "&externalProviderId=" + notExpired[0].externalProviderId;
        redirect(redirectUrl);
      }
    }
  }

  checkRedirect();

  return (
    <Layout withoutNavbar={true} withoutFooter={true}>
      <Container fixed>
        <h1>{classroom?.name}</h1>
      </Container>
      {getRows()}
      <br />
    </Layout>
  );
}
