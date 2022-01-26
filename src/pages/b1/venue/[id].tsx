import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { Layout, Venue } from "@/components";
import { ApiHelper, ClassroomInterface, LessonInterface, VenueInterface } from "@/utils";
import Link from "next/link";

export default function B1Venue() {
  const [venue, setVenue] = useState<VenueInterface>(null);
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const [classroom, setClassroom] = useState<ClassroomInterface>(null);
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => { loadData(); }, [id]);

  console.log("Venue PAGE")

  const loadData = async () => {
    if (id) {
      const v: VenueInterface = await ApiHelper.get("/venues/public/" + id, "LessonsApi");
      setVenue(v);
      const l: LessonInterface = await ApiHelper.get("/lessons/public/" + v.lessonId, "LessonsApi")
      setLesson(l);

      let search = new URLSearchParams(process.browser ? window.location.search : "");
      const classroomId = search.get("classroomId");
      ApiHelper.get("/classrooms/" + classroomId, "LessonsApi").then((c: ClassroomInterface) => { setClassroom(c); });
    }
  }

  const getVenue = () => {
    if (venue) {
      return <Venue venue={venue} resources={[]} bundles={[]} hidePrint={true} />
    }
  }

  return (
    <Layout withoutNavbar={true} withoutFooter={true}>
      <Link href={"/b1/" + classroom?.churchId}>Go back</Link>
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
