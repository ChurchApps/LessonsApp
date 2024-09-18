import { Container } from "@mui/material";
import { Layout } from "@/components/Layout";
import { ProgramInterface, StudyCategoryInterface, StudyInterface } from "@/utils/interfaces";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Image from "next/image";
import { CategoriesAndStudies } from "./components/CategoriesAndStudies";
import { ProgramVideo } from "./components/ProgramVideo";
import { HeaderWrapper } from "@/app/components/HeaderWrapper";
import { MarkdownWrapper } from "@/app/components/MarkdownWrapper";
import Error from "@/pages/_error";
import { EnvironmentHelper } from "@/utils/EnvironmentHelper";
import { Metadata } from "next";
import { MetaHelper } from "@/utils/MetaHelper";

type PageParams = {programSlug:string }

const loadData = async (programSlug:string) => {
  EnvironmentHelper.init();
  const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + programSlug, "LessonsApi");
  const studies: StudyInterface[] = await ApiHelper.getAnonymous("/studies/public/program/" + program?.id, "LessonsApi");
  const studyCategories: StudyCategoryInterface[] = await ApiHelper.getAnonymous("/studyCategories/public/program/" + program?.id, "LessonsApi");
  return {program, studies, studyCategories, errorMessage: ""};
}

let loadDataPromise:ReturnType<typeof loadData>;

const loadSharedData = async (programSlug:string) => {
  if (!loadDataPromise) loadDataPromise = loadData(programSlug);
  return loadDataPromise;
}


export async function generateMetadata({params}: {params:PageParams}): Promise<Metadata> {
  const props = await loadSharedData(params.programSlug);
  return MetaHelper.getMetaData(props.program.name + " - Free Church Curriculum", props.program.description, props.program.image);
}

export default async function ProgramPage({params}: {params:PageParams}) {
  const props = await loadSharedData(params.programSlug);
  if (props.errorMessage) return <Error message={props.errorMessage} />

  return (
    <Layout withoutNavbar>
      <div id="programHero" style={{ backgroundImage:"url('/images/programs/" + props.program.slug + ".jpg')" }}>
        <div className="content">
          <Container fixed>
            <HeaderWrapper position="static" />
            <h1>{props.program.name}</h1>
            <div style={{marginBottom:20}}>{props.program.shortDescription}</div>
            <ProgramVideo program={props.program} />
            <div style={{height:90}}></div>
            <Image src={props.program.image || "/not-found"} alt={props.program.name} width={320} height={180} className="badge" />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="programIntro">
            <h2>Studies</h2>
            <div><MarkdownWrapper value={props.program.description} /></div>
          </div>

          <CategoriesAndStudies program={props.program} studies={props.studies} studyCategories={props.studyCategories} />
        </Container>
      </div>

    </Layout>
  );
}
