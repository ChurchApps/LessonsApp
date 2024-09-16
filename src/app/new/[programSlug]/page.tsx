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

export default async function ProgramPage({params}: { params:{programSlug:string }}) {

  const loadData = async () => {
    const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params?.programSlug, "LessonsApi");
    //const provider: ProviderInterface = await ApiHelper.getAnonymous("/providers/public/" + program?.providerId, "LessonsApi");
    const studies: StudyInterface[] = await ApiHelper.getAnonymous("/studies/public/program/" + program?.id, "LessonsApi");
    const studyCategories: StudyCategoryInterface[] = await ApiHelper.getAnonymous("/studyCategories/public/program/" + program?.id, "LessonsApi");
    return {program, studies, studyCategories, errorMessage: ""};
  }

  const {program, studies, studyCategories, errorMessage} = await loadData();

  if (errorMessage) return <Error message={errorMessage} />

  return (
    <Layout pageTitle={program.name + " - Free Church Curriculum"} metaDescription={program.description} image={program.image} withoutNavbar>
      <div id="programHero" style={{ backgroundImage:"url('/images/programs/" + program.slug + ".jpg')" }}>
        <div className="content">
          <Container fixed>
            <HeaderWrapper position="static" />
            <h1>{program.name}</h1>
            <div style={{marginBottom:20}}>{program.shortDescription}</div>
            <ProgramVideo program={program} />
            <div style={{height:90}}></div>
            <Image src={program.image || "/not-found"} alt={program.name} width={320} height={180} className="badge" />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="programIntro">
            <h2>Studies</h2>
            <div><MarkdownWrapper value={program.description} /></div>
          </div>

          <CategoriesAndStudies program={program} studies={studies} studyCategories={studyCategories} />
        </Container>
      </div>

    </Layout>
  );
}
