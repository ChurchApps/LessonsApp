//import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface } from "@/utils";
//import Error from "@/pages/_error";
//import { Header } from "@/components/Header";

import { Layout } from "@/components/Layout";
import { EnvironmentHelper } from "@/utils/EnvironmentHelper";
import { LessonInterface, ProgramInterface, StudyInterface } from "@/utils/interfaces";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Image from "next/image";
import { Lessons } from "@/components/Lessons";
import { MarkdownWrapper } from "@/app/components/MarkdownWrapper";
import { Header } from "@/components/Header";


export default async function StudyPage({params}: {params:{programSlug:string, studySlug:string}}) {


  const loadData = async () => {
    await EnvironmentHelper.init();
    console.log("URL IS", "/programs/public/slug/" + params.programSlug);
    const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params.programSlug, "LessonsApi");
    const study: StudyInterface = await ApiHelper.getAnonymous("/studies/public/slug/" + program?.id + "/" + params.studySlug, "LessonsApi");
    const lessons: LessonInterface[] = await ApiHelper.getAnonymous("/lessons/public/study/" + study?.id, "LessonsApi");
    return {program, study, lessons, errorMessage: ""};
  }

  const {program, study, lessons, errorMessage} = await loadData();

  //if (errorMessage) return <Error message={errorMessage} />



  //  {study.shortDescription && <div style={{marginBottom:20}}>{study.shortDescription}</div>}
  let title = program.name + ": " + study?.name + " - Free Church Curriculum";


  return <>
    <Layout pageTitle={title} metaDescription={study.description} image={study.image} withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <Grid container spacing={2}>
              <Grid item md={7} xs={12}>
                <div className="breadcrumb"><Link href={"/" + program.slug}>{program.name}</Link></div>
                <h1>{study.name}</h1>
              </Grid>
            </Grid>

            <div style={{height:50}}></div>
            <Image className="badge" src={study.image ?? "/not-found"} alt={study.name} width={320} height={180} />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="studyIntro">
            <h2>Lessons</h2>
            <div><MarkdownWrapper value={study.description} /></div>
          </div>
          {lessons?.length > 0 && (
            <Lessons lessons={lessons} slug={`/${program.slug}/${study.slug}`} />
          )}
        </Container>
      </div>
    </Layout>
  </>

  //<Layout pageTitle={title} metaDescription={study.description} image={study.image} withoutNavbar>
  //<Header position="static" />
  /*
  return (
    <>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            header
            <Grid container spacing={2}>
              <Grid item md={7} xs={12}>
                <div className="breadcrumb"><Link href={"/" + program.slug}>{program.name}</Link></div>
                <h1>{study.name}</h1>
              </Grid>
            </Grid>

            <div style={{height:50}}></div>
            <Image className="badge" src={study.image ?? "/not-found"} alt={study.name} width={320} height={180} />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="studyIntro">
            <h2>Lessons</h2>
            <div><MarkdownPreview value={study.description} /></div>
          </div>
          {lessons?.length > 0 && (
            <Lessons lessons={lessons} slug={`/${program.slug}/${study.slug}`} />
          )}
        </Container>
      </div>
    </>
  );*/
}

/*
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
      },
      revalidate: 1
    }
  }
};
*/
