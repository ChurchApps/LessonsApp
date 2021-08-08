import Link from "next/link";
import Image from "next/image";
import { Row, Col } from "react-bootstrap";
import { LessonInterface } from "@utils/index";

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
          <Row
            style={{
              paddingBottom: 20,
              paddingTop: 20,
              borderBottom: "1px solid #CCC",
            }}
          >
            <Col xl={3}>
              <Image
                src={lesson.image}
                className="img-fluid"
                alt={lesson.name}
                width={260}
                height={145}
              />
            </Col>
            <Col xl={9}>
              <div className="title">{lesson.name}</div>
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
            </Col>
          </Row>
        </a>
      </Link>
    );
  }
  return (
    <div>
      <h2>Lessons</h2>
      {lessons.map(createLesson)}
    </div>
  );
}
