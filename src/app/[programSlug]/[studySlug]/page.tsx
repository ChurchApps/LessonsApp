import { Layout } from "@/components/Layout";
import { LessonInterface, ProgramInterface, StudyInterface } from "@/helpers/interfaces";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Image from "next/image";
import { Lessons } from "@/components/Lessons";
import { MarkdownWrapper } from "@/app/components/MarkdownWrapper";
import { HeaderWrapper } from "@/app/components/HeaderWrapper";
import Error from "@/components/Error";
import { Metadata } from "next";
import { MetaHelper } from "@/helpers/MetaHelper";
import { unstable_cache } from "next/cache";
import { EnvironmentHelper } from "@/helpers";

type PageParams = { programSlug: string, studySlug: string }

const loadData = async (params: PageParams) => {
  try {
    EnvironmentHelper.init();
    const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params.programSlug, "LessonsApi");
    const study: StudyInterface = await ApiHelper.getAnonymous("/studies/public/slug/" + program?.id + "/" + params.studySlug, "LessonsApi");
    const lessons: LessonInterface[] = await ApiHelper.getAnonymous("/lessons/public/study/" + study?.id, "LessonsApi");
    return { program, study, lessons, errorMessage: "" };
  } catch (error: any) {
    return { errorMessage: error.message }
  }
}
/*
let loadDataPromise:ReturnType<typeof loadData>;

const loadSharedData = async (params:PageParams) => {
  if (!loadDataPromise) loadDataPromise = loadData(params);
  return loadDataPromise;
}*/

const loadSharedData = async (params: Promise<PageParams>) => {
  const { programSlug, studySlug } = await params;
  const p = { programSlug, studySlug };
  const result = unstable_cache(loadData, ["/[programSlug]/[studySlug]", programSlug, studySlug], { tags: ["all"] });
  return result(p);
}


export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const props = await loadSharedData(params);
  let title = props.program.name + ": " + props.study?.name + " - Free Church Curriculum";
  if (!props.errorMessage) return MetaHelper.getMetaData(title, props.study.description, props.study.image);
}

export default async function StudyPage({ params }: { params: Promise<PageParams> }) {
  const { program, study, lessons, errorMessage } = await loadSharedData(params);

  if (errorMessage) return <Error message={errorMessage} />

  return <>
    <Layout withoutNavbar>
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

            <div style={{ height: 50 }}></div>
            <Image
              className="badge"
              src={study.image ?? "/not-found"}
              alt={`${study.name} - ${program.name} curriculum`}
              width={320}
              height={180}
              loading="eager"
              priority={true}
              quality={75}
            />
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: study.name,
            description: study.description,
            provider: {
              "@type": "Organization",
              name: "Lessons.church",
              sameAs: "https://lessons.church"
            },
            isPartOf: {
              "@type": "Course",
              name: program.name
            }
          })
        }}
      />
    </Layout>
  </>

}
