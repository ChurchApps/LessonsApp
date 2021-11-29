import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { Layout, Venue } from "@/components";
import { ApiHelper, LessonInterface, VenueInterface } from "@/utils";

export default function B1Venue() {
  const [venue, setVenue] = useState<VenueInterface>(null);
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => { loadData(); }, [id]);

  console.log("Venue PAGE")

  const loadData = async () => {
    console.log("LOAD DATA")
    if (id) {
      const v: VenueInterface = await ApiHelper.get("/venues/public/" + id, "LessonsApi");
      console.log(JSON.stringify(v));
      setVenue(v);
      const l: LessonInterface = await ApiHelper.get("/lessons/public/" + v.lessonId, "LessonsApi")
      setLesson(l);
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
      <div className="b1">
        {getVenue()}
      </div>
      <br />
    </Layout>
  );
}
