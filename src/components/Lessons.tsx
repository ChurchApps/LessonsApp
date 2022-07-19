import Link from "next/link";
import { LessonInterface } from "@/utils";
import { Grid } from "@mui/material";

type Props = {
  slug: string;
  lessons: LessonInterface[];
};

export function Lessons({ lessons, slug }: Props) {
  function createLesson(lesson: LessonInterface) {
    const url = slug + `/${lesson.slug}`;
    return (
      <Link href={url} key={lesson.id}>
        <a style={{ textDecoration: "none", color: "inherit" }}>
          <Grid container spacing={3} style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }} >
            <Grid item md={3} xs={12}>
              <img
                src={lesson.image}
                style={{verticalAlign: "middle"}}
                alt={lesson.name}
              />
            </Grid>
            <Grid item md={9} xs={12}>
              <div className="title">{lesson.name}</div>
              <h3 style={{fontSize: "28px", fontWeight: 600, margin: "0 0 8px 0"}}>{lesson.title}</h3>
              <p style={{margin: "0 0 16px 0"}}>{lesson.description}</p>
            </Grid>
          </Grid>
        </a>
      </Link>
    );
  }
  return (
    <div>
      <h2 style={{margin: "0 0 30px 0"}}>Lessons</h2>
      {lessons.map(createLesson)}
    </div>
  );
}
