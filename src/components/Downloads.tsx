import { AnalyticsHelper } from "@/appBase/helpers";
import { CommonEnvironmentHelper } from "@/appBase/helpers/CommonEnvironmentHelper";
import { ApiHelper, BundleInterface, EnvironmentHelper, ExternalVideoInterface, UserHelper } from "@/utils";
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
      AnalyticsHelper.logEvent("Download", action, label);
      if (CommonEnvironmentHelper.GoogleAnalyticsTag !== "" && typeof(window)!=="undefined") gtag("event", "conversion", { send_to: "AW-427967381/iTZUCK6U7ZkYEJWHicwB" });
    }
    const download = {
      lessonId: bundle.contentId,
      fileId: bundle.file.id,
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentUserChurch?.church?.id || "",
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
      AnalyticsHelper.logEvent("Download", action, label);
      if (CommonEnvironmentHelper.GoogleAnalyticsTag !== "" && typeof(window)!=="undefined") gtag("event", "conversion", { send_to: "AW-427967381/iTZUCK6U7ZkYEJWHicwB" });
    }
    const download = {
      lessonId: video.contentId,
      fileId: "",
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentUserChurch?.church?.id || "",
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
        <li>
          <a href={b.file?.contentPath + "&download=1"} onClick={() => { trackDownload(bundle) }} download={true}>
            {b?.name}
          </a>
        </li>
      );
    });
    return result;
  }

  const getVideos = () => {
    const result: JSX.Element[] = [];
    props.externalVideos?.forEach((v) => {
      const video = v;
      result.push(
        <li key={v.id}>
          <a href={video.download1080} onClick={(e:any) => { trackVideoDownload(video); checkExpire(video, e); }} download={true}>
            {v?.name}
          </a>
        </li>
      );
    });
    return result;
  }

  return (
    (props.bundles.length > 0 || props.externalVideos.length > 0) && (
      <>

        {getBundles()}
        {getVideos()}
        <div className="downloadResource">

          <b>No Need to Download</b><br />
          <p>Get the Lessons.church app for AndroidTV or FireSticks<br />and have your videos download automatically each week.</p>

          <Button href="https://lessons.church/#connectSection" target="_new" size="small" color="info" component="a" variant="contained">Learn How</Button>

        </div>

      </>
    )
  );
}
