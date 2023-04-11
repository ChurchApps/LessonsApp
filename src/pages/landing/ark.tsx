import { GetStaticProps } from "next";
import { HomeAbout, HomeConnect, Layout, Programs, Stats, VimeoModal } from "@/components";
import { ApiHelper, ProgramInterface, ProviderInterface } from "@/utils";
import { Grid, Container, Button, Icon } from "@mui/material";
import { FloatingSupport } from "@/appBase/components";
import Error from "../_error";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import { useState } from "react";

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

  const [vimeoPreviewId, setVimeoPreviewId] = useState<string>(null);

  if (hasError) {
    return <Error message={error.message} />
  }

  let description = "Church budgets prohibit teaching the word of God in the most effective way possible. We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let ogDescription = "We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let pageImage = "https://lessons.church/images/og-image.png";

  const video = <EmbeddedVideo videoEmbedUrl="https://www.youtube.com/embed/MHcvK1IfOvE" title="Welcome to Lessons.church" />

  return (
    <Layout metaDescription={description} image={pageImage} ogDescription={ogDescription}>
      <div id="hero" className="arkHero">
        <Container fixed>
          <h1>Children's Ministry Can be Complicated</h1>
          <h2 style={{color:"#24b8ff"}}>We Want to Make it Easy</h2>
          <div style={{textAlign: "center"}}>
            <h3>High Quality Video Curriculum</h3>
            <h3>All-in-One Technology Solution</h3>
            <h3>Sunday Morning Support</h3>
            <Button color="primary" variant="contained" size="large" href="/register" target="_blank">Start for Free</Button>
          </div>
        </Container>
      </div>

      <Container fixed style={{paddingTop:40, paddingBottom:40}}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); setVimeoPreviewId("750138454") }}>
              <img src="/images/landing/ark-video-1.png" alt="Ark Kids Junior" className="img-fluid" />
            </a>
          </Grid>
          <Grid item md={4} xs={12}>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); setVimeoPreviewId("754251052") }}>
              <img src="/images/landing/ark-video-2.png" alt="Ark Kids" className="img-fluid" />
            </a>
          </Grid>
          <Grid item md={4} xs={12}>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); setVimeoPreviewId("750131877") }}>
              <img src="/images/landing/ark-video-3.png" alt="Ark Kids" className="img-fluid" />
            </a>
          </Grid>
        </Grid>
      </Container>
      {vimeoPreviewId && <VimeoModal onClose={() => setVimeoPreviewId(null)} vimeoId={vimeoPreviewId} />}
      <div className="homeSection" style={{backgroundColor:"#CCC"}}>
        <Container fixed>
          <Grid container spacing={4}>
            <Grid item md={4} xs={12} style={{textAlign:"center"}}>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fringilla purus, et facilisis orci. Nulla sed ligula scelerisque, congue nisi sit amet, dignissim enim.</p>
              <b>John Doe</b>
            </Grid>
            <Grid item md={4} xs={12} style={{textAlign:"center"}}>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fringilla purus, et facilisis orci. Nulla sed ligula scelerisque, congue nisi sit amet, dignissim enim.</p>
              <b>John Doe</b>
            </Grid>
            <Grid item md={4} xs={12} style={{textAlign:"center"}}>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fringilla purus, et facilisis orci. Nulla sed ligula scelerisque, congue nisi sit amet, dignissim enim.</p>
              <b>John Doe</b>
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className="homeSection">
        <Container fixed>
          <Grid container spacing={3}>
            <Grid item md={1} sm={12}>
            </Grid>
            <Grid item md={4} sm={12}>
              <img src="/images/landing/ark-videos.jpg" alt="Videos" className="img-fluid" style={{borderRadius:30}} />
            </Grid>
            <Grid item md={4} sm={12}>
              <div className="arkUsp arkUspRight" style={{backgroundColor:"#DDD"}}>
                <h3>500+ High Quality Video Lessons</h3>
                <p>Ark Kids is a complete video curriculum for children's ministry. Each lesson is designed to be engaging and easy to use. We programs for both elementary and preschool.  Each lesson is crafted with care to deliver powerful, impactful messages that keep kids engaged.</p>
              </div>
            </Grid>
          </Grid>


          <Grid container spacing={3}>
            <Grid item md={3} sm={12}>
            </Grid>
            <Grid item md={5} sm={12}>
              <div style={{backgroundColor:"#DDD", position:"relative"}} className="arkUsp">
                <h3>All-In-One Technology Solution</h3>
                <p>Our technology platform is designed to make it easy for you to manage your curriculum. We provide a website for scheduling your lessons, an Android TV app that makes it simple to run your lessons, and a mobile app to guide your volunteers.</p>
              </div>
            </Grid>
            <Grid item md={4} sm={12}>
              <img src="/images/landing/ark-tech.jpg" alt="Technology" className="img-fluid" style={{borderRadius:30}} />
            </Grid>

          </Grid>


          <Grid container spacing={3}>
            <Grid item md={1} sm={12}>
            </Grid>
            <Grid item md={4} sm={12}>
              <img src="/images/landing/ark-support.jpg" alt="Support" className="img-fluid" style={{borderRadius:30}} />
            </Grid>
            <Grid item md={4} sm={12}>
              <div className="arkUsp arkUspRight" style={{backgroundColor:"#DDD"}}>
                <h3>Sunday Morning Support</h3>
                <p>We recognize the importance of your Sunday morning services and the need for prompt support. That's why we offer dedicated support on Sunday morning and throughout the week, ensuring that any questions or issues you may face are addressed quickly and efficiently.</p>
              </div>
            </Grid>
          </Grid>

        </Container>
      </div>

      <HomeConnect />

      <div className="homeSection">
        <Container fixed>
          <h2>Our Story</h2>
          <Grid container spacing={3}>
            <Grid item md={2} sm={0} />
            <Grid item md={8} sm={12} sx={{ textAlign: "center" }}>{video}</Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={1} sm={0} />
            <Grid item md={10} sm={12} sx={{ textAlign: "center" }}>

              <p className="lead"> Lessons.church is a completely free service provided to Christian churches and ministries.</p>
              <p>Every year the Church as a whole spends{" "} <b>millions of dollars</b> purchasing curriculum for classrooms. We believe by the body working together to create and distribute freely available curriculum, that money can be freed up for use in other areas. Likewise, we do not believe that budget restrictions should prevent teachers from doing the best job they possibly can. That is why we developed Lessons.church; a completely free, open-source platform for finding and managing curriculum.</p>
              <p>Lessons.church is built and provided free of charge by{" "} <a href="https://livecs.org/">Live Church Solutions</a>, a 501(c)(3) that was founded in 2012 with the goal of helping small churches with their technical needs.</p>
              <Button color="info" variant="contained" size="large" href="https://livecs.org/">Learn More About Live Church Solutions</Button>
            </Grid>
          </Grid>
        </Container>
      </div>


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
  } catch (error:any) {
    return {
      props: {
        hasError: true, error: {
          message: error.message
        }
      }
    }
  }
};
