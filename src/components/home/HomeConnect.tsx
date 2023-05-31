import { Grid, Container, Stack } from "@mui/material";
import { useState } from "react";

export function HomeConnect() {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<div className="homeSection">
    <Container fixed>
      <div className="apps">
        <Grid container justifyContent="center" spacing={3}>
          <Grid item md={6} xs={12}>
            <img src="/images/apps.png" alt="Church Apps" className="img-fluid" />
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="title">
              <span>DOWNLOAD OUR</span>
            </div>
            <h2 style={{color:"#FFF", marginBottom:0}}>TV and Mobile Apps</h2>
            <p>Great curriculum can make your teaching far more effective, but only if you can reliably deliver it each week.</p>
            <div>TV APP</div>
            <Stack direction="row" spacing={2}>
              <a href="https://play.google.com/store/apps/details?id=church.lessons.screen"><img src="/images/apps/google.png" alt="Google Play" className="img-fluid" /></a>
              <a href="https://www.amazon.com/Live-Church-Solutions-Lessons-church/dp/B09T38BNQG/"><img src="/images/apps/amazon.png" alt="Amazon App Store" className="img-fluid" /></a>
            </Stack>
            <div style={{marginTop:10}}>MOBILE APP</div>
            <Stack direction="row" spacing={2}>
              <a href="https://play.google.com/store/apps/details?id=church.b1.mobile"><img src="/images/apps/google.png" alt="Google Play" className="img-fluid" /></a>
              <a href="https://apps.apple.com/us/app/b1-church/id1610587256"><img src="/images/apps/apple.png" alt="Apple App Store" className="img-fluid" /></a>
            </Stack>
          </Grid>
        </Grid>
      </div>
    </Container>
  </div>);

}
