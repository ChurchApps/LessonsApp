import { Grid, Container } from "@mui/material";
import { Button } from "react-bootstrap";

export function HomeConnect() {

  return (
    <div className="homeSection alt" id="connectSection">
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item md={1} sm={0} />
          <Grid item md={10} sm={12} className="text-center">
            <div className="title">
              <span>Our Apps</span>
            </div>
            <h2>Using in Your Classroom</h2>
            <Grid container spacing={3}>
              <Grid item md={5} xs={12} style={{ textAlign: "left" }}>
                <p>
                  Great curriculum can make your teaching far more effective, but only if you can reliably deliver it each week.
                  See the video to learn how you can easily present your lessons from a Fire stick each week, even if the Internet goes down.
                </p>
                <p>In addition your volunteers can use the B1.church app to see the leaders notes each week.  There is nothing to print.</p>
                <p>View <a href="https://support.churchapps.org/lessons/setup.html" target="_blank" rel="noreferrer">our guide</a> on setting up schedules to configure your church.</p>
              </Grid>
              <Grid item md={7} xs={12}>
                <div className="videoWrapper">
                  <iframe
                    width="992"
                    height="558"
                    src={"https://www.youtube.com/embed/cOep9hdBey4"}
                    title="Lessons.church App"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: 20 }}>
              <Grid item xs={6}>
                <div className="d-grid gap-2">
                  <Button size="lg" variant="success" href="https://play.google.com/store/apps/details?id=church.b1.mobile" target="_blank">Get B1.church App for Volunteers</Button>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="d-grid gap-2">
                  <Button size="lg" variant="primary" href="https://www.amazon.com/dp/B09T38BNQG/" target="_blank">Get Lessons.church App for TVs</Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
