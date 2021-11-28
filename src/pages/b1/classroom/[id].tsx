import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { Layout } from "@/components";
import { ApiHelper, ClassroomInterface, ScheduleInterface } from "@/utils";
import Link from "next/link";
import { DateHelper } from "@/appBase/helpers";


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
      result.push(<Link href={"/b1/schedule/" + s.id} ><a className="bigLink">
        {DateHelper.getShortDate(DateHelper.convertToDate(s.scheduledDate))}
        <span>{s.displayName}</span>
      </a></Link>);
    });

    return result;
  }



  return (
    <Layout withoutNavbar={true} withoutFooter={true}>
      <Container>
        <h1>{classroom?.name}</h1>
      </Container>
      {getRows()}
      <br />
    </Layout>
  );
}
