import { Container, Grid, Icon } from "@mui/material";

type Props = {
  stats: any;
};

export function Stats(props: Props) {
  return (
    <div className="homeSection alt" id="statsSection">
      <Container fixed>
        <Grid container justifyContent="center">
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Grid container>
              <Grid item xs={6} className="iconBox">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11,2H13V4H15V6H13V9.4L22,13V15L20,14.2V22H14V17A2,2 0 0,0 12,15A2,2 0 0,0 10,17V22H4V14.2L2,15V13L11,9.4V6H9V4H11V2M6,20H8V15L7,14L6,15V20M16,20H18V15L17,14L16,15V20Z" /></svg>
              </Grid>
              <Grid item className="statBox">
                <div>{props.stats?.providers}</div>
                <span>providers</span>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Grid container>
              <Grid item xs={6} className="iconBox">
                <Icon>school</Icon>
              </Grid>
              <Grid item className="statBox">
                <div>{props.stats?.studies}</div>
                <span>studies</span>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Grid container>
              <Grid item xs={6} className="iconBox">
                <Icon>play_arrow</Icon>
              </Grid>
              <Grid item className="statBox">
                <div>{props.stats?.lessons}</div>
                <span>lessons</span>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Container>
    </div>
  )
}
