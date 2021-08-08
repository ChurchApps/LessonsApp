import { GetStaticPaths, GetStaticProps } from "next";
import { Container, Row, Col } from "react-bootstrap";
import { Layout, Lessons } from "@components/index";
import {
  ApiHelper,
  ProgramInterface,
  StudyInterface,
  LessonInterface,
  ArrayHelper,
} from "@utils/index";

type Props = {
  study: StudyInterface;
  program: ProgramInterface;
  lessons: LessonInterface[];
};

export default function StudyPage({ study, program, lessons }: Props) {
  const video = study.videoEmbedUrl ? (
    <div className="videoWrapper">
      <iframe
        width="992"
        height="558"
        src={study.videoEmbedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  ) : (
    <Row>
      <Col lg={{ span: 8, offset: 2 }}>
        <img
          src={study.image}
          className="img-fluid profilePic"
          alt={study.name}
        />
        <br />
        <br />
      </Col>
    </Row>
  );

  return (
    <Layout>
      <div className="pageSection">
        <Container>
          <div className="text-center">
            <h2>
              {program?.name || ""}: <span>{study?.name}</span>
            </h2>
            <p>
              <i>{study.shortDescription}</i>
            </p>
          </div>
          <p>{study.description}</p>
          {video}
          <br />
          <br />
          {lessons?.length > 0 && (
            <Lessons
              lessons={lessons}
              slug={`/${program.slug}/${study.slug}`}
            />
          )}
        </Container>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const programs: ProgramInterface[] = await ApiHelper.getAnonymous(
    "/programs/public",
    "LessonsApi"
  );

  const programsIds = programs.map((p) => p.id);

  const studies: StudyInterface[] = await ApiHelper.getAnonymous(
    `/studies/public/programs?ids=${escape(programsIds.join(","))}`,
    "LessonsApi"
  );

  const paths = studies.map((s) => ({
    params: {
      programSlug: ArrayHelper.getOne(programs, "id", s.programId).slug,
      studySlug: s.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const study: StudyInterface = await ApiHelper.getAnonymous(
    "/studies/public/slug/" + params.studySlug,
    "LessonsApi"
  );

  const program: ProgramInterface = await ApiHelper.getAnonymous(
    "/programs/public/slug/" + params.programSlug,
    "LessonsApi"
  );

  const lessons: LessonInterface[] = await ApiHelper.getAnonymous(
    "/lessons/public/study/" + study.id,
    "LessonsApi"
  );

  return {
    props: {
      study,
      program,
      lessons,
    },
  };
};
