import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { Layout, Venue } from "@/components";
import { ApiHelper, LessonInterface, ScheduleInterface, VenueInterface } from "@/utils";
import Link from "next/link";


export default function B1Schedule() {
  const [venues, setVenues] = useState<VenueInterface[]>([]);
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    if (id) {
      const s: ScheduleInterface = await ApiHelper.get("/schedules/" + id, "LessonsApi");
      const l: LessonInterface = await ApiHelper.get("/lessons/public/" + s.lessonId, "LessonsApi")
      setLesson(l);
      const venues: VenueInterface[] = await ApiHelper.get("/venues/public/lesson/" + s.lessonId, "LessonsApi");
      setVenues(venues);
    }
  }

  const getVenues = () => {
    if (venues) {
      const result: JSX.Element[] = [];
      venues.forEach(v => {
        result.push(<Link href={"/b1/venue/" + v.id} ><a className="bigLink">{v.name}</a></Link>);
      });
      return result;

    }
  }

  if (venues?.length === 1) window.location.href = "/b1/venue/" + venues[0].id;
  else {
    return (
      <Layout withoutNavbar={true} withoutFooter={true}>
        <Container>
          <h1>{lesson?.title}</h1>
        </Container>
        {getVenues()}
        <br />
      </Layout>
    );
  }
}
