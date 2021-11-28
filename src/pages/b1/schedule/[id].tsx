import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { Layout, Venue } from "@/components";
import { ApiHelper, ClassroomInterface, LessonInterface, ScheduleInterface, VenueInterface } from "@/utils";
import Link from "next/link";
import { ArrayHelper, DateHelper } from "@/appBase/helpers";


export default function B1Schedule() {
  //const [classroom, setClassroom] = useState<ClassroomInterface>(null);
  const [venue, setVenue] = useState<VenueInterface>(null);
  const [schedule, setSchedule] = useState<ScheduleInterface>(null);
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const router = useRouter();
  const id = router.query.id;


  useEffect(() => { loadData(); }, [id]);


  const loadData = async () => {
    if (id) {
      const s: ScheduleInterface = await ApiHelper.get("/schedules/" + id, "LessonsApi");
      setSchedule(s);
      const l: LessonInterface = await ApiHelper.get("/lessons/public/" + s.lessonId, "LessonsApi")
      setLesson(l);
      //const room: ClassroomInterface = await ApiHelper.get("/classrooms/" + id, "LessonsApi");
      //setClassroom(room);
      const venues: VenueInterface = await ApiHelper.get("/venues/public/lesson/" + s.lessonId, "LessonsApi");
      //ArrayHelper.getOne(venues, "name", room.
      setVenue(venues[0]);

      /*
      ApiHelper.get("/classrooms/" + id, "LessonsApi").then((c: ClassroomInterface) => {
        setClassroom(c);
        ApiHelper.get("/schedules/public/classroom/" + c.id, "LessonsApi").then((data: ScheduleInterface[]) => {
          setSchedules(data);
        });
      });*/
    }
  }

  const getVenue = () => {
    if (venue) {
      return <Venue venue={venue} resources={[]} bundles={[]} hidePrint={true} />
    }
  }



  return (
    <Layout withoutNavbar={true} withoutFooter={true}>
      <Container>
        <h1>{lesson?.title}</h1>
      </Container>
      {getVenue()}
      <br />
    </Layout>
  );
}
