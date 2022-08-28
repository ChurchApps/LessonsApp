import { Grid, Container, Button, Menu, MenuItem, Icon } from "@mui/material";
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


  return (
    <div className="homeSection alt" id="connectSection">
      <Container fixed>
        <Grid container justifyContent="center" spacing={3}>
          <Grid item md={10} sm={12} sx={{ textAlign: "center" }}>
            <div className="title">
              <span>Our Apps</span>
            </div>
            <h2 style={{ marginTop: 0 }}>Using in Your Classroom</h2>
            <Grid container spacing={3}>
              <Grid item md={5} xs={12} style={{ textAlign: "left" }}>
                <p style={{ marginTop: 0 }}>
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
                    src={"https://www.youtube.com/embed/DmDcQr0IfJg"}
                    title="Lessons.church App"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: 20 }}>
              <Grid item xs={12} md={4}>
                <Button color="success" fullWidth variant="contained" size="large" onClick={handleClick}>Get B1.church App for Volunteers</Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem onClick={() => { handleClose(); window.open("https://play.google.com/store/apps/details?id=church.b1.mobile"); }} style={{ minWidth: 303 }}><Icon>android_icon</Icon> &nbsp; Android</MenuItem>
                  <MenuItem onClick={() => { handleClose(); window.open("https://apps.apple.com/us/app/b1-church/id1610587256"); }}><Icon>apple</Icon> &nbsp; Apple</MenuItem>
                </Menu>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button color="primary" fullWidth variant="contained" size="large" href="https://www.amazon.com/dp/B09T38BNQG/" target="_blank">Get Lessons.church App for TVs</Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button color="info" fullWidth variant="contained" size="large" href="/login" style={{ backgroundColor: "#e77800" }}>Register Your Church and Schedule Lessons</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div >
  );
}
