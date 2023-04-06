import { Button, Container, Grid } from "@mui/material";

export function HomeAbout() {

  return (
    <div className="homeSection">
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item md={1} sm={0} />
          <Grid item md={10} sm={12} sx={{ textAlign: "center" }}>
            <div className="title">
              <span>Who we are</span>
            </div>
            <h2>About Lessons.church</h2>
            <p className="lead">
              Lessons.church is a completely free service provided to
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
            <p>
              Lessons.church is built and provided free of charge by{" "}
              <a href="https://livecs.org/">Live Church Solutions</a>, a
              501(c)(3) that was founded in 2012 with the goal of helping
              small churches with their technical needs.
            </p>
            <Button color="info" variant="contained" size="large" href="https://livecs.org/">
              Learn More About Live Church Solutions
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
