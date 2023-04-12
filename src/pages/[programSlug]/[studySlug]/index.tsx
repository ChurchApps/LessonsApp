import { GetStaticPaths, GetStaticProps } from "next";
import { Layout, Lessons, MarkdownPreview } from "@/components";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface, ArrayHelper } from "@/utils";
import { Grid, Container, Box } from "@mui/material";
import Error from "@/pages/_error";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import Image from "next/image";

type Props = {
  study: StudyInterface;
  program: ProgramInterface;
  lessons: LessonInterface[];
  hasError: Boolean;
  error: {
    message: string;
  };
};

export default function StudyPage(props: Props) {

  if (props.hasError) {
    return <Error message={props.error.message} />
  }

  const video = props.study.videoEmbedUrl
    ? (
      <EmbeddedVideo videoEmbedUrl={props.study.videoEmbedUrl} title={props.study.name} />
    )
    : (
      <Image src={props.study.image || ""} className="img-fluid" alt={props.study.name} width={960} height={540} style={{height:"auto"}} />
    );


  let title = props.program.name + ": " + props.study?.name + " - Free Church Curriculum";
  return (
    <Layout pageTitle={title} metaDescription={props.study.description} image={props.study.image}>
      <div className="pageSection">
        <Container fixed>
          <h2 style={{marginTop: 0}}>{props.program?.name || ""}: <span>{props.study?.name}</span></h2>
          <Grid container spacing={2}>
            <Grid item md={(video)? 7 : 12} xs={12}>
              {props.study.shortDescription && <p style={{marginTop:0}} className="lead">{props.study.shortDescription}</p>}
              <MarkdownPreview value={props.study.description} />
            </Grid>
            {video && <Grid item md={5} xs={12}>
              {video}
            </Grid> }
          </Grid>

          <br />
          {props.lessons?.length > 0 && (
            <Lessons lessons={props.lessons} slug={`/${props.program.slug}/${props.study.slug}`} />
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
  try {
    const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params.programSlug, "LessonsApi");
    const study: StudyInterface = await ApiHelper.getAnonymous("/studies/public/slug/" + program?.id + "/" + params.studySlug, "LessonsApi");
    const lessons: LessonInterface[] = await ApiHelper.getAnonymous("/lessons/public/study/" + study?.id, "LessonsApi");

    return {
      props: { study, program, lessons, hasError: false },
      revalidate: 30,
    };
  } catch (error:any) {
    return {
      props: {
        hasError: true, error: {
          message: error.message
        }
      }
    }
  }
};
