import { Metadata } from "next";
import { Button, Container, Grid } from "@mui/material";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import { Layout } from "@/components/Layout";
import { MetaHelper } from "@/helpers/MetaHelper";
import { FloatingSupportWrapper } from "../../components/FloatingSupportWrapper";
import { HomeConnect } from "../../components/HomeConnect";
import { Videos } from "./components/videos";

export async function generateMetadata(): Promise<Metadata> {
  let description = "Church budgets prohibit teaching the word of God in the most effective way possible. We provide high quality content to churches completely free of charge, thanks to our generous partners.";
  let ogDescription = "We provide high quality content to churches completely free of charge, thanks to our generous partners.";
  let pageImage = "https://lessons.church/images/og-image.png";
  return MetaHelper.getMetaData("The Ark Church Children's Curriculum", description, pageImage, ogDescription);
}

export default async function ArkHome() {
  const video = (
    <EmbeddedVideo videoEmbedUrl="https://www.youtube.com/embed/MHcvK1IfOvE" title="Welcome to Lessons.church" />
  );

  return (
    <Layout>
      <div id="hero" className="arkHero">
        <Container fixed>
          <h1>Children's Ministry Can be Complicated</h1>
          <h2 style={{ color: "#24b8ff", marginBottom: "2rem" }}>We Want to Make it Easy</h2>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "1rem" }}>High Quality Video Curriculum</h3>
            <h3 style={{ marginBottom: "1rem" }}>All-in-One Technology Solution</h3>
            <h3 style={{ marginBottom: "2rem" }}>Sunday Morning Support</h3>
            <Button
              color="primary"
              variant="contained"
              size="large"
              href="/register"
              target="_blank"
              sx={{ padding: "12px 32px", fontSize: "1.1rem" }}>
              Start for Free
            </Button>
          </div>
        </Container>
      </div>

      <Videos />
      <div className="homeSection" style={{ backgroundColor: "#f5f5f5", padding: "4rem 0" }}>
        <Container fixed>
          <Grid container spacing={4}>
            <Grid size={{ md: 4, xs: 12 }} style={{ textAlign: "center" }}>
              <p
                style={{
                  minHeight: 100,
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                  marginBottom: "1rem"
                }}>
                Lessons.church provides fun, biblical lessons with materials designed for different age groups, allowing
                families to discuss the same lesson together.
              </p>
              <b style={{ fontSize: "1.1rem" }}>Sarah DeLitta</b>
              <br />
              Bedford Outpost Church, VA
            </Grid>
            <Grid size={{ md: 4, xs: 12 }} style={{ textAlign: "center" }}>
              <p
                style={{
                  minHeight: 100,
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                  marginBottom: "1rem"
                }}>
                We love how Lessons.Church has provided a multitude of resources at our fingertips. It makes scheduling
                super easy!
              </p>
              <b style={{ fontSize: "1.1rem" }}>Chelsea Boldt</b>
              <br />
              Venture Christian Church, TX
            </Grid>
            <Grid size={{ md: 4, xs: 12 }} style={{ textAlign: "center" }}>
              <p
                style={{
                  minHeight: 100,
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                  marginBottom: "1rem"
                }}>
                Lessons.church is a valuable resource of engaging, biblical and practical curriculum that is easy to
                incorporate into our children's ministry!
              </p>
              <b style={{ fontSize: "1.1rem" }}>Erin B.</b>
              <br />
              Lake City Christian Church, FL
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className="homeSection" style={{ padding: "4rem 0" }}>
        <Container fixed>
          <Grid container spacing={3}>
            <Grid size={{ md: 1, sm: 12 }}></Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <img
                src="/images/landing/ark-videos.jpg"
                alt="Videos"
                className="img-fluid"
                style={{ borderRadius: 30, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <div
                className="arkUsp arkUspRight"
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "2rem",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                <h3 style={{ marginBottom: "1rem", color: "#24b8ff" }}>500+ High Quality Video Lessons</h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                  Ark Kids is a complete video curriculum for children's ministry. Each lesson is designed to be
                  engaging and easy to use. We programs for both elementary and preschool. Each lesson is crafted with
                  care to deliver powerful, impactful messages that keep kids engaged.
                </p>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={3} style={{ marginTop: "3rem" }}>
            <Grid size={{ md: 3, sm: 12 }}></Grid>
            <Grid size={{ md: 5, sm: 12 }}>
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "2rem",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
                className="arkUsp">
                <h3 style={{ marginBottom: "1rem", color: "#24b8ff" }}>All-In-One Technology Solution</h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                  Our technology platform is designed to make it easy for you to manage your curriculum. We provide a
                  website for scheduling your lessons, an Android TV app that makes it simple to run your lessons, and a
                  mobile app to guide your volunteers.
                </p>
              </div>
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <img
                src="/images/landing/ark-tech.jpg"
                alt="Technology"
                className="img-fluid"
                style={{ borderRadius: 30, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} style={{ marginTop: "3rem" }}>
            <Grid size={{ md: 1, sm: 12 }}></Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <img
                src="/images/landing/ark-support.jpg"
                alt="Support"
                className="img-fluid"
                style={{ borderRadius: 30, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <div
                className="arkUsp arkUspRight"
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "2rem",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                <h3 style={{ marginBottom: "1rem", color: "#24b8ff" }}>Sunday Morning Support</h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                  We recognize the importance of your Sunday morning services and the need for prompt support. That's
                  why we offer dedicated support on Sunday morning and throughout the week, ensuring that any questions
                  or issues you may face are addressed quickly and efficiently.
                </p>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>

      <HomeConnect />

      <div className="homeSection" style={{ padding: "4rem 0", backgroundColor: "#f5f5f5" }}>
        <Container fixed>
          <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>Our Story</h2>
          <Grid container spacing={3}>
            <Grid size={{ md: 2, sm: 0 }} />
            <Grid size={{ md: 8, sm: 12 }} sx={{ textAlign: "center" }}>
              {video}
            </Grid>
          </Grid>

          <Grid container spacing={3} style={{ marginTop: "3rem" }}>
            <Grid size={{ md: 1, sm: 0 }} />
            <Grid size={{ md: 10, sm: 12 }} sx={{ textAlign: "center" }}>
              <p className="lead" style={{ fontSize: "1.3rem", marginBottom: "1.5rem" }}>
                Lessons.church is a completely free service provided to Christian churches and ministries.
              </p>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                Every year the Church as a whole spends <b>millions of dollars</b> purchasing curriculum for classrooms.
                We believe that by working together to create and distribute freely available curriculum, that money can
                be freed up for use in other areas. Likewise, we do not believe that budget restrictions should prevent
                teachers from doing the best job they possibly can. That is why we developed Lessons.church; a
                completely free, open-source platform for finding and managing curriculum.
              </p>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "2rem" }}>
                Lessons.church is built and provided free of charge by{" "}
                <a href="https://livecs.org/" style={{ color: "#24b8ff", textDecoration: "none" }}>
                  Live Church Solutions
                </a>
                , a 501(c)(3) that was founded in 2012 with the goal of helping small churches with their technical
                needs.
              </p>
              <Button
                color="info"
                variant="contained"
                size="large"
                href="https://livecs.org/"
                sx={{ padding: "12px 32px", fontSize: "1.1rem" }}>
                Learn More About Live Church Solutions
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>

      <FloatingSupportWrapper />
    </Layout>
  );
}
