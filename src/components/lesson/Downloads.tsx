import { AnalyticsHelper, CommonEnvironmentHelper } from "@churchapps/apphelper";
import { ApiHelper, FeedDownloadInterface, FeedFileInterface, UserHelper } from "@/utils";
import { Icon } from "@mui/material";

type Props = {
  downloads: FeedDownloadInterface[];
  lessonId: string;
};

export function Downloads(props: Props) {

  const trackDownload = (download: FeedDownloadInterface) => {
    if (CommonEnvironmentHelper.GoogleAnalyticsTag) {
      const action = download.name;
      const label = window.location.pathname;
      AnalyticsHelper.logEvent("Download", action, label);
    }
    const d = {
      lessonId: props.lessonId,
      fileId: download.files[0].id,
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: download.name
    }
    ApiHelper.post("/downloads", [d], "LessonsApi");
  }

  const checkExpire = (file: FeedFileInterface, e: React.MouseEvent) => {
    if (!file.expires) return;
    if (new Date(file.expires) < new Date()) {
      e.preventDefault();
      ApiHelper.getAnonymous("/externalVideos/public/" + file.id, "LessonsApi").then(v => {
        window.location.href = v.download1080;
      });
    }
  }

  const getDownloads = () => {
    const result: JSX.Element[] = [];
    props.downloads?.forEach((d, idx) => {
      result.push(
        <li key={"download-" + idx}>
          <a href={d.files[0].url} onClick={(e) => { trackDownload(d); checkExpire(d.files[0], e) }} download={true}>
            <Icon>download</Icon>
            {d?.name}
          </a>
        </li>
      );
    });
    return result;
  }


  return (
    (props.downloads?.length > 0) && (
      <>
        <ul>
          {getDownloads()}
        </ul>
      </>
    )
  );
}
