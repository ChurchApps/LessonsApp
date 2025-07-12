//import { HomeAbout, HomeConnect, Layout, Programs } from "@/components/home";
import { HomeAbout } from "@/app/components/HomeAbout";
import { HomeConnect } from "@/app/components/HomeConnect";
import { Layout } from "@/components/Layout";
import { Programs } from "@/app/components/Programs";
import { ProgramInterface, ProviderInterface } from "@/helpers/interfaces";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Error from "@/components/Error";
import { HomeTestimonials } from "@/app/components/HomeTestimonials";
import { HomeHero } from "@/app/components/HomeHero";
import { Container, Grid, Link } from "@mui/material";
import Image from "next/image";
import { FloatingSupportWrapper } from "./components/FloatingSupportWrapper";
import { Metadata } from "next";
import { MetaHelper } from "@/helpers/MetaHelper";
import { revalidateTag } from "next/cache";

const loadData = async () => {
  console.log("LOAD DATA");
  const excludeIds = ["CMCkovCA00e", "yBl-EUBxm17"];
  let programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi", ["all"]);
  const providers: ProviderInterface[] = await ApiHelper.getAnonymous("/providers/public", "LessonsApi", ["all"]);
  const studies: ProviderInterface[] = await ApiHelper.getAnonymous("/studies/public", "LessonsApi", ["all"]);
  const stats: {churchCount: number, lessonCount: number, studyCount: number, programCount: number} = await ApiHelper.getAnonymous("/providers/stats", "LessonsApi", ["all"]);

  programs = programs.filter((p) => !excludeIds.includes(p.id));
  return { programs, providers, studies, stats, errorMessage: "" };
}


export async function generateMetadata(): Promise<Metadata> {
  return MetaHelper.getMetaData();
}

export default async function Home(props: {
  params: Promise<{}>;
  searchParams: Promise<{ clearCache?: string }>;
}) {
  const { searchParams } = props;
  const { clearCache } = await searchParams;

  const pageProps = await loadData();
  const { programs, providers, studies, stats, errorMessage } = pageProps;

  if (clearCache) { console.log("CLEARING CACHE"); revalidateTag("all"); }

  if (errorMessage) return <Error message={errorMessage} />

  //const headersList = headers();
  //headersList.set('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=2500000');


  const getElmPrograms = () => (<>
    <Grid item md={2} sm={4} xs={4}>
      <Link href="/high-voltage">
        <Image alt="High Voltage Elementary" width={256} height={144} style={{ height: "auto" }} placeholder="empty" className="img-fluid" src="https://content.lessons.church/programs/yBl-EUBxm17.png?dt=1625530793952" />
      </Link>
    </Grid>
    <Grid item md={2} sm={4} xs={4}>
      <Link href="/faith-kidz">
        <Image alt="Faith Kidz" width={256} height={144} style={{ height: "auto" }} placeholder="empty" className="img-fluid" src="https://content.lessons.church/programs/CMCkovCA00e.png?dt=1724178996201" />
      </Link>
    </Grid>
    <Grid item md={2} sm={4} xs={4}>
      <Link href="/west-ridge">
        <Image alt="West Ridge" width={256} height={144} style={{ height: "auto" }} placeholder="empty" className="img-fluid" src="https://content.lessons.church/programs/CjDN3VrEm3s.png?dt=1695316859942" />
      </Link>
    </Grid>
  </>)

  const getElementaryDiv = () => (
    <div className="programPromo" style={{ backgroundImage: "url('/images/home/elementary.png')" }}>
      <div className="programHeroContent">
        <Container fixed>
          <Grid container spacing={3}>
            <Grid item md={7} xs={12}>
              <div className="age">ELEMENTARY</div>
              <h2>Additional Elementary Curriculum Offered by Partner Organizations</h2>
              <p style={{ width: "67%" }}>More fun curriculum!</p>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="programStudies">
            {getElmPrograms()}

          </Grid>
        </Container>
      </div>
    </div>
  );

  return (
    <Layout withoutNavbar>

      <HomeHero stats={stats} />
      <HomeAbout />
      <Programs programs={programs} providers={providers} studies={studies} />
      {getElementaryDiv()}
      <HomeTestimonials />
      <HomeConnect />

      <FloatingSupportWrapper />
    </Layout>
  );
}

