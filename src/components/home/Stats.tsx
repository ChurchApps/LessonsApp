import { Grid } from "@mui/material";

type Props = {
  stats: any;
};

export function Stats(props: Props) {
  return (
    <div style={{marginTop:60}}>

      <Grid container>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Grid container>
            <Grid item xs={4} className="iconBox">
              <img src="/images/home/programs-icon.png" alt="programs" className="img-fluid" />
            </Grid>
            <Grid item xs={8} className="statBox">
              <div>{props.stats?.providers}</div>
              <span>providers</span>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Grid container>
            <Grid item xs={4} className="iconBox">
              <img src="/images/home/studies-icon.png" alt="studies" className="img-fluid" />
            </Grid>
            <Grid item xs={8} className="statBox">
              <div>{props.stats?.studies}</div>
              <span>studies</span>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Grid container>
            <Grid item xs={4} className="iconBox">
              <img src="/images/home/lessons-icon.png" alt="lessons" className="img-fluid" />
            </Grid>
            <Grid item xs={8} className="statBox">
              <div>{props.stats?.lessons}</div>
              <span>lessons</span>
            </Grid>
          </Grid>
        </Grid>

      </Grid>

    </div>
  )
}
