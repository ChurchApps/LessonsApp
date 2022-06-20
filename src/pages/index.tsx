import { GetStaticProps } from "next";
import { HomeAbout, HomeConnect, Layout, Programs } from "@/components";
import { ApiHelper, ProgramInterface, ProviderInterface } from "@/utils";
import { Grid, Container, Button } from "@mui/material";

type Props = {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
};

export default function Home({ programs, providers }: Props) {

  let description = "Church budgets prohibit teaching the word of God in the most effective way possible. We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let ogDescription = "We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let pageImage = "https://lessons.church/images/og-image.png";

  return (
    <Layout metaDescription={description} image={pageImage} ogDescription={ogDescription}>
      <div id="hero">
        <Container fixed>
          <Grid container spacing={3}>
            <Grid item md={2} sm={0} />
            <Grid item md={8} sm={12} className="text-center">
              <h1>
                Completely <span>Free Curriculum</span> for Churches
              </h1>
              <p>
                We believe that limited church budgets should never stand in the way of teaching both children and adults the word of God in the
                most effective way possible. By partnering with generous creators willing to donate their work for other churches to use
                we are able to provide this content for your church completely free of charge.
              </p>
              <div>

                <Button color="success" variant="contained" size="large" href="/login">
                  Get Started for Free
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>

      <HomeAbout />
      <Programs programs={programs} providers={providers} />
      <HomeConnect />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");
  const providers: ProviderInterface[] = await ApiHelper.getAnonymous("/providers/public", "LessonsApi");

  return {
    props: { programs, providers },
    revalidate: 30,
  };
};
