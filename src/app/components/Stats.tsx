"use client";

import { Grid } from "@mui/material";
import { useEffect } from "react";

interface Props {
  stats: any;
}

export function Stats(props: Props) {

  const countDuration = 5000;

  const increaseCount = (elapsed: number) => {
    if (elapsed<=countDuration) {
      let percent = elapsed / countDuration;
      if (percent > 1) percent = 1;
      setNewVal("providerCount", percent);
      setNewVal("studyCount", percent);
      setNewVal("lessonCount", percent);
      requestAnimationFrame(() => increaseCount(elapsed + 50));
      //setTimeout(() => increaseCount(elapsed + 50), 50);
    }
  }

  const setNewVal = (id: string, percent: number) => {
    const div = document.getElementById(id) as HTMLElement;
    const val = parseInt(div.dataset.val || "0");
    const newCount = Math.floor(val * percent);
    div.innerText = newCount.toString();
  }

  useEffect(() => {
    increaseCount(0);
  }, []);

  return (
    <div style={{marginTop:60}}>

      <Grid container>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Grid container>
            <Grid item xs={4} className="iconBox">
              <img src="/images/home/programs-icon.png" alt="programs" className="img-fluid" />
            </Grid>
            <Grid item xs={8} className="statBox">
              <div id="providerCount" data-val={props.stats?.providers}>{props.stats?.providers}</div>
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
              <div id="studyCount" data-val={props.stats?.studies}>{props.stats?.studies}</div>
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
              <div id="lessonCount" data-val={props.stats?.lessons}>{props.stats?.lessons}</div>
              <span>lessons</span>
            </Grid>
          </Grid>
        </Grid>

      </Grid>

    </div>
  )



}
