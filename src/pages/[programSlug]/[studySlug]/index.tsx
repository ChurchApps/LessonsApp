import { GetStaticPaths, GetStaticProps } from "next";
import { Layout, Lessons } from "@/components";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface, ArrayHelper } from "@/utils";
import { Grid, Container } from "@mui/material";

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
    <Grid container spacing={3}>
      <Grid item md={2} sm={0} />
      <Grid item md={8} sm={12}>
        <img src={props.study.image} className="img-fluid profilePic" alt={props.study.name} /><br /><br />
      </Grid>
    </Grid>
  );

  let title = props.program.name + ": " + props.study?.name + " - Lessons.church";
  return (
    <Layout pageTitle={title} metaDescription={props.study.description} image={props.study.image}>
      <div className="pageSection">
        <Container fixed>
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
