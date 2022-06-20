import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { ApiHelper, ClassroomInterface, ScheduleInterface } from "@/utils";
import Link from "next/link";
import { ArrayHelper, DateHelper } from "@/appBase/helpers";
import { Container } from "@mui/material";


export default function Venue() {
  const [classroom, setClassroom] = useState<ClassroomInterface>(null);
  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);
  const router = useRouter();
  const id = router.query.id;


  useEffect(() => { loadData(); }, [id]);


  const loadData = () => {
    if (id) {
      ApiHelper.get("/classrooms/" + id, "LessonsApi").then((c: ClassroomInterface) => {
        setClassroom(c);
        ApiHelper.get("/schedules/public/classroom/" + c.id, "LessonsApi").then((data: ScheduleInterface[]) => {
          setSchedules(data);
        });
      });
    }
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    schedules?.forEach(s => {
      result.push(<Link href={"/b1/venue/" + s.venueId + "?classroomId=" + classroom?.id} ><a className="bigLink">
        {DateHelper.getShortDate(DateHelper.convertToDate(s.scheduledDate))}
        <span>{s.displayName}</span>
      </a></Link>);
    });

    return result;
  }

  const checkRedirect = () => {
    if (schedules) {
      let notExpired: ScheduleInterface[] = [];
      const cutOff = new Date();
      cutOff.setDate(cutOff.getDate() - 1);
      schedules.forEach(s => { if (DateHelper.convertToDate(s.scheduledDate) >= cutOff) notExpired.push(s); });

      if (notExpired.length > 0) {
        notExpired = notExpired.sort((a, b) => {
          const dateA = DateHelper.convertToDate(a.scheduledDate);
          const dateB = DateHelper.convertToDate(b.scheduledDate);
          return (dateA < dateB) ? -1 : 1;
        });
        window.location.href = "/b1/venue/" + notExpired[0].venueId + "?classroomId=" + classroom?.id;
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
