import { GetStaticPaths, GetStaticProps } from "next";
import { Container, Row, Col } from "react-bootstrap";
import { Layout, Lessons } from "@/components";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface, ArrayHelper } from "@/utils";

type Props = {
  study: StudyInterface;
  program: ProgramInterface;
  lessons: LessonInterface[];
};

export default function StudyPage(props: Props) {
  const video = props.study.videoEmbedUrl ? (
    <div className="videoWrapper">
      <iframe width="992" height="558" src={props.study.videoEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen ></iframe>
    </div>
  ) : (
    <Row>
      <Col lg={{ span: 8, offset: 2 }}>
        <img src={props.study.image} className="img-fluid profilePic" alt={props.study.name} /><br /><br />
      </Col>
    </Row>
  );

  return (
    <Layout pageTitle={props.program.name + ": " + props.study?.name + " - Lessons.church"}>
      <div className="pageSection">
        <Container>
          <div className="text-center">
            <h2>{props.program?.name || ""}: <span>{props.study?.name}</span></h2>
            <p><i>{props.study.shortDescription}</i></p>
          </div>
          <p>{props.study.description}</p>
          {video}
          <br />
          <br />
          {props.lessons?.length > 0 && (
            <Lessons lessons={props.lessons} slug={`/${props.program.slug}/${props.study.slug}`}
            />
          )}
        </Container>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");

  const programsIds = programs.map((p) => p.id);

  const studies: StudyInterface[] = await ApiHelper.getAnonymous(`/studies/public/programs?ids=${escape(programsIds.join(","))}`, "LessonsApi");

  const paths = studies.map((s) => ({
    params: { programSlug: ArrayHelper.getOne(programs, "id", s.programId).slug, studySlug: s.slug, },
  }));

  return { paths, fallback: "blocking", };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params.programSlug, "LessonsApi");
  const study: StudyInterface = await ApiHelper.getAnonymous("/studies/public/slug/" + program.id + "/" + params.studySlug, "LessonsApi");
  const lessons: LessonInterface[] = await ApiHelper.getAnonymous("/lessons/public/study/" + study.id, "LessonsApi");

  return {
    props: { study, program, lessons, },
    revalidate: 30,
  };
};
