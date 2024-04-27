import { GetStaticPaths, GetStaticProps } from "next";
import { Layout, Lessons } from "@/components";
import { MarkdownPreview } from "@churchapps/apphelper";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface } from "@/utils";
import { Grid, Container } from "@mui/material";
import Error from "@/pages/_error";
import Image from "next/image";
import { Header } from "@/components/Header";
import Link from "next/link";
import { ExternalProviderHelper } from "@/utils/ExternalProviderHelper";

type Props = {
  providerId: string;
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
                <div className="breadcrumb"><Link href={"/external/" + props.providerId + "/" + props.program.id}>{props.program.name}</Link></div>
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
            <Lessons lessons={props.lessons} slug={`/external/${props.providerId}/${props.program.id}/${props.study.id}`} />
          )}
        </Container>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths:any[] = [];
  return { paths, fallback: "blocking", };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const lessonList = await ApiHelper.getAnonymous("/externalProviders/" + params.providerId + "/lessons", "LessonsApi");
    const {study, program} = ExternalProviderHelper.getStudy(lessonList, params.programId as string, params.studyId as string);

    return {
      props: { providerId: params.providerId, study, program, lessons:study.lessons, hasError: false },
      revalidate: 30,
    };
  } catch (error:any) {
    return {
      props: {
        hasError: true, error: {
          message: error.message
        }
      },
      revalidate: 1
    }
  }
};
