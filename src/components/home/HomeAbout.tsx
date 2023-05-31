import { Button, Container, Grid } from "@mui/material";

export function HomeAbout() {

  return (
    <div className="homeSection">
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12}>
            Video placeholder
          </Grid>
          <Grid item md={6} sm={12}>
            <div className="title">
              <span>Who we are</span>
            </div>
            <h2>About Lessons.church</h2>
            <p>
              <b>Lessons.church</b> is a completely free service provided to
              Christian churches and ministries.
            </p>
            <p>
              Every year the Church as a whole spends{" "}
              <b>millions of dollars</b> purchasing curriculum for classrooms.
              We believe by the body working together to create and distribute
              freely available curriculum, that money can be freed up for use
              in other areas. Likewise, we do not believe that budget
              restrictions should prevent teachers from doing the best job
              they possibly can. That is why we developed Lessons.church; a
              completely free, open-source platform for finding and managing
              curriculum.
            </p>
            <a href="https://livecs.org/" className="cta">
              Learn More
            </a>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
