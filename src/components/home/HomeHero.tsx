import { AppBar, Box, Container, Grid, Link, Stack } from "@mui/material";
import { Stats } from "./Stats";

type Props = {
  stats: any;
};


export function HomeHero(props: Props) {

  const getAppBar = () => (
    <AppBar id="navbar" position="static">
      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Link href="/" className="logo"><img src="/images/logo-dark.png" alt="Lessons.church - Free Curriculum for Churches" className="img-fluid" /></Link>
          <Box sx={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>Test</Box>
        </Stack>
      </Container>
    </AppBar>
  );

  const getLeftContent = () => (<>
    {getAppBar()}
    <Grid container spacing={3}>
      <Grid item md={7} xs={12}>
        <div className="title">Free Church Lessons</div>
        <h1>Completely Free Curriculum for Churches</h1>
        <p>We believe that limited church budgets should never stand in the way of teaching both children and adults the word of God in the most effective way possible.</p>
        <a href="#" className="cta">Join for <b>FREE</b> Curriculum</a>
        <Stats stats={props.stats} />
      </Grid>
    </Grid>
  </>);

  return (
    <div id="hero">
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            {getLeftContent()}
          </Grid>
          <Grid item xs={2} style={{backgroundColor:"#FF0000", marginTop:0}}>
            Right
          </Grid>
        </Grid>
      </Container>
    </div>

  );
}
