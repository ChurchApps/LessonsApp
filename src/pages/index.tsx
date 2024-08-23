import { GetStaticProps } from "next";
import { HomeAbout, HomeConnect, Layout, Programs } from "@/components";
import { ApiHelper, ProgramInterface, ProviderInterface, StudyInterface } from "@/utils";
import { FloatingSupport } from "@churchapps/apphelper";
import Error from "./_error";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HomeHero } from "@/components/home/HomeHero";
import { Container, Grid, Link } from "@mui/material";
import Image from "next/image";

type Props = {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
  studies: StudyInterface[];
  stats: any;
  hasError: Boolean;
  error: {
    message: string;
  };
};

export default function Home({ programs, providers, studies, stats, hasError, error }: Props) {

  if (hasError) {
    return <Error message={error.message} />
  }

  let description = "Church budgets prohibit teaching the word of God in the most effective way possible. We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let ogDescription = "We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let pageImage = "https://lessons.church/images/og-image.png";


  const getElmPrograms = () => (<>
    <Grid item md={2} sm={4} xs={4}>
      <Link href="/high-voltage">
        <Image alt="High Voltage Elementary" width={256} height={144} style={{height:"auto"}} placeholder="empty" className="img-fluid" src="https://content.lessons.church/programs/yBl-EUBxm17.png?dt=1625530793952" />
      </Link>
    </Grid>
    <Grid item md={2} sm={4} xs={4}>
      <Link href="/faith-kidz">
        <Image alt="Faith Kidz" width={256} height={144} style={{height:"auto"}} placeholder="empty" className="img-fluid" src="https://content.lessons.church/programs/CMCkovCA00e.png?dt=1724178996201" />
      </Link>
    </Grid>
  </>)

  const getElementaryDiv = () => (
    <div className="programPromo" style={{ backgroundImage:"url('/images/home/elementary.png')" }}>
      <div className="programHeroContent">
        <Container fixed>
          <Grid container spacing={3}>
            <Grid item md={7} xs={12}>
              <div className="age">ELEMENTARY</div>
              <h2>Additional Elementary Curriculum Offered by Partner Organizations</h2>
              <p style={{width:"67%"}}>More fun curriculum!</p>
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
    <Layout metaDescription={description} image={pageImage} ogDescription={ogDescription} withoutNavbar>
      <HomeHero stats={stats} />
      <HomeAbout />
      <Programs programs={programs} providers={providers} studies={studies} />
      {getElementaryDiv()}
      <HomeTestimonials />
      <HomeConnect />

      <FloatingSupport appName="Lessons.church" />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const excludeIds = ["CMCkovCA00e", "yBl-EUBxm17"];
    let programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");
    const providers: ProviderInterface[] = await ApiHelper.getAnonymous("/providers/public", "LessonsApi");
    const studies: ProviderInterface[] = await ApiHelper.getAnonymous("/studies/public", "LessonsApi");
    const stats: any = await ApiHelper.getAnonymous("/providers/stats", "LessonsApi");

    programs = programs.filter((p) => !excludeIds.includes(p.id));

    return {
      props: { programs, providers, studies, stats, hasError: false },
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
