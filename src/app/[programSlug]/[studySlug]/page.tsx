import { Layout } from "@/components/Layout";
import { LessonInterface, ProgramInterface, StudyInterface } from "@/utils/interfaces";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Image from "next/image";
import { Lessons } from "@/components/Lessons";
import { MarkdownWrapper } from "@/app/components/MarkdownWrapper";
import { HeaderWrapper } from "@/app/components/HeaderWrapper";
import Error from "@/pages/_error";
import { EnvironmentHelper } from "@/utils/EnvironmentHelper";

export default async function StudyPage({params}: {params:{programSlug:string, studySlug:string}}) {

  const loadData = async () => {
    EnvironmentHelper.init();
    const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params.programSlug, "LessonsApi");
    const study: StudyInterface = await ApiHelper.getAnonymous("/studies/public/slug/" + program?.id + "/" + params.studySlug, "LessonsApi");
    const lessons: LessonInterface[] = await ApiHelper.getAnonymous("/lessons/public/study/" + study?.id, "LessonsApi");
    return {program, study, lessons, errorMessage: ""};
  }

  const {program, study, lessons, errorMessage} = await loadData();

  if (errorMessage) return <Error message={errorMessage} />

  let title = program.name + ": " + study?.name + " - Free Church Curriculum";

  return <>
    <Layout pageTitle={title} metaDescription={study.description} image={study.image} withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <HeaderWrapper position="static" />
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

}
