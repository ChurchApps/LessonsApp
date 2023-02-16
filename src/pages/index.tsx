import { GetStaticProps } from "next";
import { HomeAbout, HomeConnect, Layout, Programs, Stats } from "@/components";
import { ApiHelper, ProgramInterface, ProviderInterface } from "@/utils";
import { Grid, Container, Button, Icon } from "@mui/material";
import { FloatingSupport } from "@/appBase/components";
import Error from "./_error";

type Props = {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
  stats: any;
  hasError: Boolean;
  error: {
    message: string;
  };
};

export default function Home({ programs, providers, stats, hasError, error }: Props) {

  if (hasError) {
    return <Error message={error.message}/>
  }

  let description = "Church budgets prohibit teaching the word of God in the most effective way possible. We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let ogDescription = "We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let pageImage = "https://lessons.church/images/og-image.png";

  const video = (
    <div className="videoWrapper">
      <iframe
        width="992"
        height="558"
        src="https://www.youtube.com/embed/MHcvK1IfOvE?rel=0"
        title="Welcome to Lessons.church"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );

  return (
    <Layout metaDescription={description} image={pageImage} ogDescription={ogDescription}>
      <div id="hero">
        <Container fixed>
          <Grid container justifyContent="center">
            <Grid item md={9} sm={12} sx={{ textAlign: "center" }}>
              <h1>
                Completely <span>Free Curriculum</span> for Churches
              </h1>
              <p>
                We believe that limited church budgets should never stand in the way of teaching both children and adults the word of God in the
                most effective way possible. By partnering with generous creators willing to donate their work for other churches to use
                we are able to provide this content for your church completely free of charge.
              </p>
              {video}
            </Grid>
          </Grid>

        </Container>
      </div>

      <Stats stats={stats} />

      <Programs programs={programs} providers={providers} />
      <HomeConnect />
      <HomeAbout />
      <FloatingSupport appName="Lessons.church" />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");
    const providers: ProviderInterface[] = await ApiHelper.getAnonymous("/providers/public", "LessonsApi");
    const stats: any = await ApiHelper.getAnonymous("/providers/stats", "LessonsApi");
  return {
    props: { programs, providers, stats, hasError: false },
    revalidate: 30,
  };
  } catch (error) {
    return {
      props: {
          hasError: true, error: {
            message: error.message
          }
      }
    }
  }
};
