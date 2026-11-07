import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@mui/material";
import { ApiHelper } from "@churchapps/apphelper";
import { HeaderWrapper } from "@/app/components/HeaderWrapper";
import { MarkdownWrapper } from "@/app/components/MarkdownWrapper";
import { Layout } from "@/components/Layout";
import { EnvironmentHelper } from "@/helpers";
import { MetaHelper } from "@/helpers/MetaHelper";
import { SITE_URL, SeoHelper } from "@/helpers/SeoHelper";
import { ProgramInterface, StudyCategoryInterface, StudyInterface } from "@/helpers/interfaces";
import { CategoriesAndStudies } from "./components/CategoriesAndStudies";
import { ProgramVideo } from "./components/ProgramVideo";

type PageParams = { programSlug: string };

// Render each program on first request, then serve it from the cache and refresh hourly.
export const revalidate = 3600;
export async function generateStaticParams(): Promise<PageParams[]> { return []; }

interface LoadDataResult {
  program?: ProgramInterface;
  studies?: StudyInterface[];
  studyCategories?: StudyCategoryInterface[];
  errorMessage: string;
}

//NOTE: These api calls only fire once per page load.  NextJS remembers the results and reuses them on subsequent calls.
const loadData = async (programSlug: string): Promise<LoadDataResult> => {
  EnvironmentHelper.init();
  const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + programSlug, "LessonsApi");
  const studies: StudyInterface[] = await ApiHelper.getAnonymous("/studies/public/program/" + program?.id, "LessonsApi");
  const studyCategories: StudyCategoryInterface[] = await ApiHelper.getAnonymous("/studyCategories/public/program/" + program?.id, "LessonsApi");
  return { program, studies, studyCategories, errorMessage: "" };
};

// loadData throws on failure so a failed load is never cached.
const loadSharedData = async (programSlug: string): Promise<LoadDataResult> => {
  try {
    return await unstable_cache(loadData, ["/[programSlug]", programSlug], { tags: ["all"], revalidate: 3600 })(programSlug);
  } catch (error: unknown) {
    return { errorMessage: String(error) };
  }
};

const getJsonLd = (program: ProgramInterface) => {
  const url = SITE_URL + "/" + program.slug;
  const name = SeoHelper.cleanName(program.name);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": url + "#course",
        name,
        url,
        description: SeoHelper.programDescription(name, program.age, program.description),
        ...(program.image ? { image: program.image } : {}),
        ...SeoHelper.common(SeoHelper.publisherFromAbout(program.aboutSection), program.age)
      },
      SeoHelper.breadcrumbs([{ name, url }])
    ]
  };
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { programSlug } = await params;
  const props = await loadSharedData(programSlug);
  const program = props.program;
  if (!props.errorMessage && program?.id) {
    const name = SeoHelper.cleanName(program.name);
    return MetaHelper.getMetaData(name + " - Free Church Curriculum", SeoHelper.programDescription(name, program.age, program.description), program.image, undefined, "/" + program.slug);
  }
  return MetaHelper.getMetaData();
}

export default async function ProgramPage({ params }: { params: Promise<PageParams> }) {
  const { programSlug } = await params;
  const props = await loadSharedData(programSlug);
  // Throw rather than render an error page, so a failed API call is never cached as a 200.
  if (props.errorMessage) throw new Error(props.errorMessage);
  if (!props.program?.id) notFound();
  // The slug lookup is case-insensitive; send /Ark-Preschool to /ark-preschool instead of serving a duplicate.
  if (props.program.slug && props.program.slug !== programSlug) permanentRedirect("/" + props.program.slug);

  return (
    <Layout withoutNavbar>
      <div id="programHero" style={{ backgroundImage: "url('/images/programs/" + props.program!.slug + ".jpg')" }}>
        <div className="content">
          <Container fixed>
            <HeaderWrapper position="static" />
            <h1>{props.program!.name}</h1>
            <div style={{ marginBottom: 20 }}>{props.program!.shortDescription}</div>
            <ProgramVideo program={props.program!} />
            <div style={{ height: 90 }}></div>
            <Image
              src={props.program!.image || "/not-found"}
              alt={props.program!.name || ""}
              width={320}
              height={180}
              className="badge"
              loading="eager"
              priority={true}
              quality={75}
            />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="programIntro">
            <h2>Studies</h2>
            <div>
              <MarkdownWrapper value={props.program!.description ?? ""} />
            </div>
          </div>

          <CategoriesAndStudies
            program={props.program!}
            studies={props.studies ?? []}
            studyCategories={props.studyCategories ?? []}
          />
        </Container>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SeoHelper.jsonLd(getJsonLd(props.program!)) }} />
    </Layout>
  );
}
