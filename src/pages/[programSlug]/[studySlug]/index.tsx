import { GetStaticPaths, GetStaticProps } from "next";
import { Layout, Lessons, MarkdownPreview } from "@/components";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface, ArrayHelper } from "@/utils";
import { Grid, Container, Box } from "@mui/material";
import ErrorComponent from "@/pages/_error";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import Image from "next/image";
import { Header } from "@/components/Header";
import Link from "next/link";

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
    return <ErrorComponent message={props.error.message} />
  }

  /*
    {props.study.shortDescription && <div style={{marginBottom:20}}>{props.study.shortDescription}</div>}
  */
  let title = props.program.name + ": " + props.study?.name + " - Free Church Curriculum";
  return (
    <Layout pageTitle={title} metaDescription={props.study.description} image={props.study.image} withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <Grid container spacing={2}>
              <Grid item md={7} xs={12}>
                <div className="breadcrumb"><Link href={"/" + props.program.slug}>{props.program.name}</Link></div>
                <h1>{props.study.name}</h1>
              </Grid>
            </Grid>

            <div style={{height:50}}></div>
            <Image className="badge" src={props.study.image ?? "/not-found"} alt={props.study.name} width={320} height={180} />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="studyIntro">
            <h2>Lessons</h2>
            <div><MarkdownPreview value={props.study.description} /></div>
          </div>
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
    // const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params.programSlug, "LessonsApi");
    // const study: StudyInterface = await ApiHelper.getAnonymous("/studies/public/slug/" + program?.id + "/" + params.studySlug, "LessonsApi");
    // const lessons: LessonInterface[] = await ApiHelper.getAnonymous("/lessons/public/study/" + study?.id, "LessonsApi");

    throw new Error("TEST. Error in rendering the Study Page.")

    // return {
    //   props: { study, program, lessons, hasError: false },
    //   revalidate: 30,
    // };
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
