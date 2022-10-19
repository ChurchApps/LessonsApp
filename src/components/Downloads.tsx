import { ApiHelper, BundleInterface, EnvironmentHelper, ExternalVideoInterface, GoogleAnalyticsHelper, UserHelper } from "@/utils";
import { WindowSharp } from "@mui/icons-material";
import { Grid, Menu, MenuItem, Icon, Button } from "@mui/material";
import { useState } from "react";

type Props = {
  bundles: BundleInterface[];
  externalVideos: ExternalVideoInterface[];
};

export function Downloads(props: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const trackDownload = (bundle: BundleInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag) {
      const action = bundle.name;
      const label = window.location.pathname;
      GoogleAnalyticsHelper.gaEvent({ category: "Download", action: action, label: label });
    }
    const download = {
      lessonId: bundle.contentId,
      fileId: bundle.file.id,
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentChurch?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: "Bundle - " + bundle.name
    }
    ApiHelper.post("/downloads", [download], "LessonsApi");
  }

  const trackVideoDownload = (video: ExternalVideoInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag) {
      const action = video.name;
      const label = window.location.pathname;
      GoogleAnalyticsHelper.gaEvent({ category: "Download", action: action, label: label });
    }
    const download = {
      lessonId: video.contentId,
      fileId: "",
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentChurch?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: "Video - " + video.name
    }
    ApiHelper.post("/downloads", [download], "LessonsApi");
  }

  const checkExpire = (video: ExternalVideoInterface, e: React.MouseEvent) => {
    if (new Date(video.downloadsExpire) < new Date()) {
      e.preventDefault();
      ApiHelper.get("/externalVideos/public/" + video.id, "LessonsApi").then(v => {
        window.location.href = v.download1080;
      });
    }
  }


  const getBundles = () => {
    const result: JSX.Element[] = [];
    props.bundles?.forEach((b) => {
      const bundle = b;
      let downloadLink = (<Button href={b.file?.contentPath + "&download=1"} size="small" onClick={() => { trackDownload(bundle) }} download={true} color="success" component="a" variant="contained">Download</Button>);
      result.push(
        <div className="downloadResource" key={b.id}>
          <MenuItem>
            <Grid container columnSpacing={2}>
              <Grid item xs={7}>{b?.name}</Grid>
              <Grid item xs={5} style={{ textAlign: "right" }}>{downloadLink}</Grid>
            </Grid>
          </MenuItem>
        </div>
      );
    });
    return result;
  }

  const getVideos = () => {
    const result: JSX.Element[] = [];
    props.externalVideos?.forEach((v) => {
      const video = v;
      let downloadLink = (<Button href={video.download1080} size="small" onClick={(e) => { trackVideoDownload(video); checkExpire(video, e); }} download={true} color="success" component="a" variant="contained">Download</Button>);
      result.push(
        <div className="downloadResource" key={v.id}>
          <MenuItem>
            <Grid container columnSpacing={2}>
              <Grid item xs={7}>{v?.name}</Grid>
              <Grid item xs={5} style={{ textAlign: "right" }}>{downloadLink}</Grid>
            </Grid>
          </MenuItem>
        </div>
      );
    });
    return result;
  }

  return (
    (props.bundles.length > 0 || props.externalVideos.length > 0) && (
      <>
        <Button id="downloadButton" variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)} endIcon={<Icon>keyboard_arrow_down</Icon>} size="small" style={{ float: "right" }}>Downloads</Button>
        <Menu id="basic-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => { setAnchorEl(null) }} MenuListProps={{ "aria-labelledby": "downloadButton" }}>
          {getBundles()}
          {getVideos()}
          <hr />
          <div className="downloadResource">
            <MenuItem>
              <Grid container columnSpacing={2}>
                <Grid item xs={9} style={{ fontStyle: "italic" }}>
                  <b>Don't want to download lessons each week?</b><br />
                  Get the Lessons.church app for AndroidTV or FireSticks<br />and have your videos download automatically each week.
                </Grid>
                <Grid item xs={3} style={{ textAlign: "right" }}>
                  <Button href="https://lessons.church/#connectSection" target="_new" size="small" color="info" component="a" variant="contained">Learn How</Button>
                </Grid>
              </Grid>
            </MenuItem>
          </div>
        </Menu>
      </>
    )
  );
}
