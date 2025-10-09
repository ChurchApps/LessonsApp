import { Icon } from "@mui/material";
import { AnalyticsHelper, CommonEnvironmentHelper } from "@churchapps/apphelper";
import { ApiHelper, FeedDownloadInterface, UserHelper } from "@/helpers";

interface Props {
  downloads: FeedDownloadInterface[];
  lessonId: string;
}

export function Downloads(props: Props) {
  const trackDownload = (download: FeedDownloadInterface) => {
    if (CommonEnvironmentHelper.GoogleAnalyticsTag && CommonEnvironmentHelper.GoogleAnalyticsTag !== "") {
      const action = download.name;
      const label = window.location.pathname;
      try {
        AnalyticsHelper.logEvent("Download", action, label);
      } catch (error) {
        console.warn('Analytics logging failed:', error);
      }
    }
    const d = {
      lessonId: props.lessonId,
      fileId: download.files[0].id,
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: download.name
    };
    ApiHelper.post("/downloads", [d], "LessonsApi");
  };

  const getDownloads = () => {
    const result: JSX.Element[] = [];
    props.downloads?.forEach((d, idx) => {
      result.push(<li key={"download-" + idx}>
        <a
          href={d.files[0].url}
          onClick={e => {
            trackDownload(d);
          }}
          download={true}>
          <Icon>download</Icon>
          {d?.name}
        </a>
      </li>);
    });
    return result;
  };

  return (
    props.downloads?.length > 0 && (
      <>
        <ul>{getDownloads()}</ul>
      </>
    )
  );
}
