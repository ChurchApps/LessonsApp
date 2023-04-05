import { GetStaticPaths, GetStaticProps } from "next";
import { Grid, Container, Box } from "@mui/material";
import { Layout, Venues } from "@/components";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface, ArrayHelper, VenueInterface, ResourceInterface, BundleInterface, ExternalVideoInterface } from "@/utils";
import { MarkdownPreview } from "@/components";
import Error from "@/pages/_error";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";

type Props = { program: ProgramInterface; study: StudyInterface; lesson: LessonInterface; venues: VenueInterface[]; resources: ResourceInterface[]; externalVideos: ExternalVideoInterface[]; bundles: BundleInterface[]; hasError: boolean; error: { message: string }; };

export default function LessonsPage(props: Props) {

  if (props.hasError) {
    return <Error message={props.error.message} />
  }

  const video = props.lesson.videoEmbedUrl
    ? (<EmbeddedVideo videoEmbedUrl={props.lesson.videoEmbedUrl} title={props.lesson.title} />)
    : (
      <Grid container spacing={3}>
        <Grid item md={2} sm={0} />
        <Grid item md={8} sm={12}>
          <img src={props.lesson.image} className="profilePic" alt={props.lesson.name} /><br /><br />
        </Grid>
      </Grid>
    );

  const title = props.program.name + ": " + props.lesson?.title + " - Lessons.church";
  return (
    <Layout pageTitle={title} metaDescription={props.lesson.description} image={props.lesson.image}>
      <div className="pageSection">
        <Container fixed>
          <Box sx={{ textAlign: "center" }}>
            <div className="title">
              {props.program?.name}: <span>{props.study?.name}</span>
            </div>
            <h2 style={{ marginTop: 0 }}>
              {props.lesson?.name}: <span>{props.lesson?.title}</span>
            </h2>
          </Box>
          {video}
          <p>{props.lesson?.description}</p>
          <Venues venues={props.venues} resources={props.resources} externalVideos={props.externalVideos} bundles={props.bundles} />
          {props.program.aboutSection && (
            <>
              <h4 style={{ marginTop: 40 }}>About {props.program.name}</h4>
              <MarkdownPreview value={props.program.aboutSection} />
            </>
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
  const studyIds = studies.map((s) => s.id);

  const lessons: LessonInterface[] = await ApiHelper.getAnonymous(`/lessons/public/studies?ids=${escape(studyIds.join(","))}`, "LessonsApi");

  const paths = lessons.map((l) => {
    const study: StudyInterface = ArrayHelper.getOne(studies, "id", l.studyId);
    const program: ProgramInterface = ArrayHelper.getOne(programs, "id", study.programId);
    return { params: { programSlug: program.slug, studySlug: study.slug, lessonSlug: l.slug, }, };
  });

  return { paths, fallback: "blocking", };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const lessonData = await ApiHelper.getAnonymous("/lessons/public/slug/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");
    const lesson: LessonInterface = lessonData.lesson;
    const study: StudyInterface = lessonData.study;
    const program: ProgramInterface = lessonData.program;
    const venues: VenueInterface[] = lessonData.venues;
    const bundles: BundleInterface[] = lessonData.bundles;
    const resources: ResourceInterface[] = lessonData.resources;
    const externalVideos: ExternalVideoInterface[] = lessonData.externalVideos;

    resources?.forEach(r => {
      if (r.variants) r.variants = ArrayHelper.getAll(r.variants, "hidden", false);
    });

    return {
      props: { program, study, lesson, venues, resources, externalVideos, bundles, hasError: false },
      revalidate: 30,
    };
  } catch (error: any) {
    return {
      props: {
        hasError: true, error: {
          message: error.message
        }
      }
    }
  }

};
