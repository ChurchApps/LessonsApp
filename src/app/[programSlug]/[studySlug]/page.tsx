import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { ApiHelper } from "@churchapps/apphelper";
import { HeaderWrapper } from "@/app/components/HeaderWrapper";
import { MarkdownWrapper } from "@/app/components/MarkdownWrapper";
import { Layout } from "@/components/Layout";
import { Lessons } from "@/components/Lessons";
import { EnvironmentHelper } from "@/helpers";
import { MetaHelper } from "@/helpers/MetaHelper";
import { SITE_URL, SeoHelper } from "@/helpers/SeoHelper";
import { LessonInterface, ProgramInterface, StudyInterface } from "@/helpers/interfaces";

type PageParams = { programSlug: string; studySlug: string };

// Render each study on first request, then serve it from the cache and refresh hourly.
export const revalidate = 3600;
export async function generateStaticParams(): Promise<PageParams[]> { return []; }

type LoadDataResult = { program?: ProgramInterface; study?: StudyInterface; lessons?: LessonInterface[]; errorMessage: string };

const loadData = async (params: PageParams): Promise<LoadDataResult> => {
  EnvironmentHelper.init();
  const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params.programSlug, "LessonsApi");
  const study: StudyInterface = await ApiHelper.getAnonymous("/studies/public/slug/" + program?.id + "/" + params.studySlug, "LessonsApi");
  const lessons: LessonInterface[] = await ApiHelper.getAnonymous("/lessons/public/study/" + study?.id, "LessonsApi");
  return { program, study, lessons, errorMessage: "" };
};

// loadData throws on failure so a failed load is never cached.
const loadSharedData = async (params: Promise<PageParams>): Promise<LoadDataResult> => {
  const { programSlug, studySlug } = await params;
  try {
    return await unstable_cache(loadData, ["/[programSlug]/[studySlug]", programSlug, studySlug], { tags: ["all"], revalidate: 3600 })({ programSlug, studySlug });
  } catch (error: any) {
    return { errorMessage: error.message };
  }
};

const getJsonLd = (program: ProgramInterface, study: StudyInterface, lessonCount: number) => {
  const programUrl = SITE_URL + "/" + program.slug;
  const url = programUrl + "/" + study.slug;
  const programName = SeoHelper.cleanName(program.name);
  const name = SeoHelper.cleanName(study.name);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": url + "#course",
        name,
        url,
        description: SeoHelper.studyDescription(programName, name, lessonCount, study.description),
        ...(study.image ? { image: study.image } : {}),
        ...SeoHelper.common(SeoHelper.publisherFromAbout(program.aboutSection), program.age),
        isPartOf: { "@type": "Course", "@id": programUrl + "#course", name: programName, url: programUrl }
      },
      SeoHelper.breadcrumbs([{ name: programName, url: programUrl }, { name, url }])
    ]
  };
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const props = await loadSharedData(params);
  if (!props.errorMessage && props.study?.id) {
    const programName = SeoHelper.cleanName(props.program?.name);
    const studyName = SeoHelper.cleanName(props.study.name);
    const title = SeoHelper.studyTitle(programName, studyName);
    const description = SeoHelper.studyDescription(programName, studyName, props.lessons?.length, props.study.description);
    return MetaHelper.getMetaData(title, description, props.study.image, undefined, "/" + props.program?.slug + "/" + props.study.slug);
  }
  return MetaHelper.getMetaData();
}

export default async function StudyPage({ params }: { params: Promise<PageParams> }) {
  const { program, study, lessons, errorMessage } = await loadSharedData(params);

  // Throw rather than render an error page, so a failed API call is never cached as a 200.
  if (errorMessage) throw new Error(errorMessage);
  if (!study?.id) notFound();
  // Slug lookups are case-insensitive; redirect case variants to the one canonical URL.
  const { programSlug, studySlug } = await params;
  if (program?.slug && study.slug && (program.slug !== programSlug || study.slug !== studySlug)) permanentRedirect("/" + program.slug + "/" + study.slug);

  return (
    <>
      <Layout withoutNavbar>
        <div id="studyHero">
          <div className="content">
            <Container fixed>
              <HeaderWrapper position="static" />
              <Grid container spacing={2}>
                <Grid size={{ md: 7, xs: 12 }}>
                  <div className="breadcrumb">
                    <Link href={"/" + program!.slug}>{program!.name}</Link>
                  </div>
                  <h1>{study!.name}</h1>
                </Grid>
              </Grid>

              <div style={{ height: 50 }}></div>
              <Image
                className="badge"
                src={study!.image ?? "/not-found"}
                alt={`${study!.name} - ${program!.name} curriculum`}
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
              <div>
                <MarkdownWrapper value={study!.description ?? ""} />
              </div>
            </div>
            {lessons && lessons.length > 0 && <Lessons lessons={lessons} slug={`/${program!.slug}/${study!.slug}`} />}
          </Container>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SeoHelper.jsonLd(getJsonLd(program!, study!, lessons?.length ?? 0)) }} />
      </Layout>
    </>
  );
}
