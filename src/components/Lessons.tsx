import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card, Grid } from "@mui/material";
import { LessonInterface } from "@/helpers";

interface Props {
  slug: string;
  lessons: LessonInterface[];
}

const Lessons = React.memo(({ lessons, slug }: Props) => {
  const createLesson = React.useCallback(
    (lesson: LessonInterface) => {
      const url = slug.startsWith("/external/") ? slug + `/${lesson.id}` : slug + `/${lesson.slug}`;

      return (
        <Grid item md={6} xs={12} key={lesson.id}>
          <Link href={url} key={lesson.id} style={{ textDecoration: "none", color: "inherit" }}>
            <Card style={{ padding: 10 }} className="lessonCard">
              <Grid container spacing={1}>
                <Grid item xs={5}>
                  <Image
                    src={lesson.image || "/not-found"}
                    alt={lesson.name}
                    width={640}
                    height={360}
                    style={{ height: "auto" }}
                    className="img-fluid"
                  />
                </Grid>
                <Grid item xs={7}>
                  <div className="name">{lesson.name}</div>
                  <h3>{lesson.title}</h3>
                  <div className="fadeOut">{lesson.description}</div>
                  <div className="seeMore">SEE MORE</div>
                </Grid>
              </Grid>
            </Card>
          </Link>
        </Grid>
      );
    },
    [slug]
  );

  const lessonCards = React.useMemo(() => lessons.map(createLesson), [lessons, createLesson]);

  return (
    <div>
      <Grid container spacing={3} style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
        {lessonCards}
      </Grid>
    </div>
  );
});

Lessons.displayName = "Lessons";

export { Lessons };
