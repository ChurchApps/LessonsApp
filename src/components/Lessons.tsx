import Link from "next/link";
import { LessonInterface } from "@/helpers";
import { Card, Grid } from "@mui/material";
import Image from "next/image";

interface Props {
  slug: string;
  lessons: LessonInterface[];
}

export function Lessons({ lessons, slug }: Props) {

  function createLesson(lesson: LessonInterface) {
    const url = (slug.startsWith("/external/"))
      ? slug + `/${lesson.id}`
      : slug + `/${lesson.slug}`;

    return (
      <Grid item md={6} xs={12} key={lesson.id}>
        <Link href={url} key={lesson.id} style={{ textDecoration: "none", color: "inherit" }}>
          <Card style={{padding:10}} className="lessonCard">
            <Grid container spacing={1}>
              <Grid item xs={5}>
                <Image src={lesson.image || "/not-found"} alt={lesson.name} width={640} height={360} style={{height:"auto"}} className="img-fluid" />
              </Grid>
              <Grid item xs={7}>
                <div className="name">{lesson.name}</div>
                <h3>{lesson.title}</h3>
                <div className="fadeOut">
                  {lesson.description}
                </div>
                <div className="seeMore">SEE MORE</div>
              </Grid>
            </Grid>
          </Card>
        </Link>
      </Grid>
    );
  }

  return (
    <div>
      <Grid container spacing={3} style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
        {lessons.map(createLesson)}
      </Grid>
    </div>
  );
}
