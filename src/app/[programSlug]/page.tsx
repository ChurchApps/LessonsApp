import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { Container } from "@mui/material";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import { HeaderWrapper } from "@/app/components/HeaderWrapper";
import { MarkdownWrapper } from "@/app/components/MarkdownWrapper";
import Error from "@/components/Error";
import { Layout } from "@/components/Layout";
import { EnvironmentHelper } from "@/helpers";
import { MetaHelper } from "@/helpers/MetaHelper";
import { ProgramInterface, StudyCategoryInterface, StudyInterface } from "@/helpers/interfaces";
import { CategoriesAndStudies } from "./components/CategoriesAndStudies";
import { ProgramVideo } from "./components/ProgramVideo";

type PageParams = { programSlug: string };

interface LoadDataResult {
  program?: ProgramInterface;
  studies?: StudyInterface[];
  studyCategories?: StudyCategoryInterface[];
  errorMessage: string;
}

//NOTE: These api calls only fire once per page load.  NextJS remembers the results and reuses them on subsequent calls.
const loadData = async (programSlug: string): Promise<LoadDataResult> => {
  EnvironmentHelper.init();
  try {
    const program: ProgramInterface = await ApiHelper.getAnonymous(
      "/programs/public/slug/" + programSlug,
      "LessonsApi"
    );
    const studies: StudyInterface[] = await ApiHelper.getAnonymous(
      "/studies/public/program/" + program?.id,
      "LessonsApi"
    );
    const studyCategories: StudyCategoryInterface[] = await ApiHelper.getAnonymous(
      "/studyCategories/public/program/" + program?.id,
      "LessonsApi"
    );
    return { program, studies, studyCategories, errorMessage: "" };
  } catch (error: unknown) {
    console.log("inside catch: ", error);
    return { errorMessage: String(error) };
  }
};

const loadSharedData = (programSlug: string) => {
  const result = unstable_cache(loadData, ["/[programSlug]", programSlug], { tags: ["all"] });
  return result(programSlug);
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { programSlug } = await params;
  const props = await loadSharedData(programSlug);
  if (!props.errorMessage)
    return MetaHelper.getMetaData(
      props.program.name + " - Free Church Curriculum",
      props.program.description,
      props.program.image
    );
}

export default async function ProgramPage({ params }: { params: Promise<PageParams> }) {
  const { programSlug } = await params;
  const props = await loadSharedData(programSlug);
  if (props.errorMessage) return <Error message={props.errorMessage} />;

  return (
    <Layout withoutNavbar>
      <div id="programHero" style={{ backgroundImage: "url('/images/programs/" + props.program.slug + ".jpg')" }}>
        <div className="content">
          <Container fixed>
            <HeaderWrapper position="static" />
            <h1>{props.program.name}</h1>
            <div style={{ marginBottom: 20 }}>{props.program.shortDescription}</div>
            <ProgramVideo program={props.program} />
            <div style={{ height: 90 }}></div>
            <Image
              src={props.program.image || "/not-found"}
              alt={props.program.name}
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
              <MarkdownWrapper value={props.program.description} />
            </div>
          </div>

          <CategoriesAndStudies
            program={props.program}
            studies={props.studies}
            studyCategories={props.studyCategories}
          />
        </Container>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: props.program.name,
            description: props.program.description,
            provider: {
              "@type": "Organization",
              name: "Lessons.church",
              sameAs: "https://lessons.church"
            }
          })
        }}
      />
    </Layout>
  );
}
