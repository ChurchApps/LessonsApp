import { Container, Fade, Grid, Link, Slide, Stack } from "@mui/material";
import { Header } from "../../components/Header";
import { Stats } from "./Stats";

interface Props {
  stats: any;
}

export function HomeHero(props: Props) {
  const getAppBar = () => <Header position="static" />;
  /*
    <AppBar id="navbar" position="static">
      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Link href="/" className="logo"><img src="/images/logo-dark.png" alt="Lessons.church - Free Curriculum for Churches" className="img-fluid" /></Link>
          <Box sx={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>Test</Box>
        </Stack>
      </Container>
    </AppBar>
    */

  const getLeftContent = () => (
    <>
      <Grid container spacing={3}>
        <Grid size={{ md: 7, xs: 12 }}>
          <Slide direction="up" in={true} timeout={800}>
            <Fade in={true} timeout={800}>
              <div>
                <div className="title">Free Church Lessons</div>
                <h1>Completely Free Curriculum for Churches</h1>
              </div>
            </Fade>
          </Slide>
          <p>
            We believe that limited church budgets should never stand in the way of teaching both children and adults
            the word of God in the most effective way possible.
          </p>
          <Link href="/login?action=register" className="cta" underline="none" style={{ color: "#FFF" }}>
            Join for <b>FREE</b> Curriculum
          </Link>
          <Stats stats={props.stats} />
        </Grid>
      </Grid>
    </>
  );

  const getAge = (name: string, anchor: string) => (
    <a href={"#" + anchor} className="ageBox" key={anchor}>
      <div className="ageIcon">
        <img src={"/images/home/hero-" + name.toLowerCase() + ".png"} alt={name} className="img-fluid" />
      </div>
    </a>
  );

  const getAges = () => {
    const result = [getAge("Preschool", "ark-preschool"), getAge("Elementary", "ark"), getAge("Teen", "forministryresources"), getAge("Adult", "next-level")];

    return (
      <Fade in={true} timeout={2000}>
        <div>
          <Stack spacing={1} style={{ padding: "50px 5px 0px 5px" }} direction={{ xs: "row", md: "column" }}>
            {result}
          </Stack>
        </div>
      </Fade>
    );
  };

  return (
    <div id="hero">
      <Container fixed>
        {getAppBar()}
        <Grid container spacing={3}>
          <Grid size={{ md: 10, xs: 12 }}>
            {getLeftContent()}
          </Grid>
          <Grid size={{ md: 2, xs: 12 }}>
            {getAges()}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
