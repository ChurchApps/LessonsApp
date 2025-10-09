import Image from "next/image";
import React from "react";
import { AnalyticsHelper } from "@churchapps/apphelper";
import { MarkdownPreviewLight } from "@churchapps/apphelper-markdown";
import { ApiHelper, FeedActionInterface, FeedFileInterface, UserHelper } from "@/helpers";
import { ImageModal } from "../ImageModal";
import { VideoModal } from "../VideoModal";

interface Props {
  action: FeedActionInterface;
  lessonId: string;
}

export function Action(props: Props) {
  const [showPreview, setShowPreview] = React.useState(false);

  /*
  const trackDownload = (variant: VariantInterface) => {
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources, "id", variant.resourceId);
    const action = resource.name + " - " + variant.name;
    const label = window.location.pathname;
    AnalyticsHelper.logEvent("Download", action, label);
    //if (CommonEnvironmentHelper.GoogleAnalyticsTag !== "" && typeof(window)!=="undefined") gtag("event", "conversion", { send_to: "AW-427967381/iTZUCK6U7ZkYEJWHicwB" });
    const download = {
      lessonId: props.lessonId,
      fileId: variant.fileId,
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: "Variant - " + variant.name
    }
    ApiHelper.post("/downloads", [download], "LessonsApi");
  }

  const trackView = (video: ExternalVideoInterface) => {
    const action = video.name;
    const label = window.location.pathname;
    AnalyticsHelper.logEvent("Preview", action, label);
    //if (CommonEnvironmentHelper.GoogleAnalyticsTag !== "" && typeof(window)!=="undefined") gtag("event", "conversion", { send_to: "AW-427967381/iTZUCK6U7ZkYEJWHicwB" });
    const download = {
      lessonId: props.lessonId,
      fileId: "",
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: "Video - " + video.name
    }
    ApiHelper.post("/downloads", [download], "LessonsApi");
  }
  */
  /*
  const getPreviewData = () => {
    const result: {
      type: string,
      thumbnail: string,
      name: string,
      url: string,
      videoId: string,
      seconds: number,
      loopVideo?: boolean,
      action: (e: React.MouseEvent) => void
    } = { type: "", thumbnail: "", name: "", url: "", videoId: "", seconds: 0, action: () => {} };
    const video: ExternalVideoInterface = ArrayHelper.getOne(props.externalVideos || [], "id", props.action.externalVideoId);
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources || [], "id", props.action.resourceId);
    const asset = (props.action.assetId && resource) ? ArrayHelper.getOne(resource?.assets || [], "id", props.action.assetId) : null;
    if (asset) {
      result.type = "asset";
      result.url = asset?.file?.contentPath;
      result.name = resource?.name + ": " +  asset?.name;
      result.action = (e) => { e.preventDefault(); trackDownload(asset); setShowPreview(true); };
      result.thumbnail = asset?.file?.thumbPath || asset?.file?.contentPath || "";
    } else if (resource) {
      result.type = "resource";
      result.url = resource.variants[0]?.file?.contentPath;
      result.name = resource.name;
      result.action = (e) => { e.preventDefault(); trackDownload(resource.variants[0]); setShowPreview(true); };
      result.thumbnail = resource?.assets[0]?.file?.contentPath || resource?.variants[0]?.file?.thumbPath || resource?.variants[0]?.file?.contentPath || "";
    } else if (video) {
      result.type = "video";
      result.url = "https://vimeo.com/" + video.videoId;
      result.name = video.name;
      result.action = (e) => { e.preventDefault(); trackView(video); setShowPreview(true); };
      result.thumbnail = video.thumbnail;
      result.videoId = video.videoId;
      result.seconds = parseInt(video.seconds);
      result.loopVideo = video.loopVideo;
    }
    return result;
  }
  */

  let result = <></>;

  switch (props.action.actionType) {
  case "note":
    result = (
      <div className="note">
        <MarkdownPreviewLight value={props.action.content} />
      </div>
    );
    break;
  case "do":
    result = (
      <div className="actions">
        <MarkdownPreviewLight value={props.action.content} />
      </div>
    );
    break;
  case "say":
    result = (
      <div className="say">
        <MarkdownPreviewLight value={props.action.content} />
      </div>
    );
    break;
  case "add-on":
    result = <div>{props.action.content}</div>;
    break;
  case "play":
    const f = props.action.files[0];
    if (!f) {
      result = (
        <div className="playAction">
          <a href="#" className="text">
            {props.action.content}
          </a>
        </div>
      );
    } else {
      let duration = null;
      if (f?.seconds > 0) {
        const min = Math.floor(f.seconds / 60);
        const sec = f.seconds % 60;
        duration = <span className="duration">{min.toString() + ":" + sec.toString().padStart(2, "0")}</span>;
      }
      let thumbnail = f.thumbnail || f.url || "";
      if (thumbnail.indexOf(".mp4") > -1 || thumbnail.indexOf(".webm") > -1) thumbnail = "";

      result = (
        <div className="playAction">
          {duration}
          {thumbnail && (
            <Image src={thumbnail} alt={props.action.content} width={128} height={72} style={{ height: 72 }} />
          )}
          <a
            href={f.url}
            rel="noopener noreferrer"
            onClick={e => {
              e.preventDefault();
              handlePreviewClick(f);
            }}
            className="text">
            {props.action.content}
          </a>
          {f.streamUrl && showPreview && (
            <VideoModal onClose={() => setShowPreview(false)} url={f.streamUrl} loopVideo={f.loop} />
          )}
          {!f.streamUrl && showPreview && <ImageModal onClose={() => setShowPreview(false)} url={f.url} />}
        </div>
      );
    }
    break;
  }

  const handlePreviewClick = (file: FeedFileInterface) => {
    const action = file.name;
    const label = window.location.pathname;
    try {
      AnalyticsHelper.logEvent("Preview", action, label);
    } catch (error) {
      console.warn('Analytics logging failed:', error);
    }
    const download = {
      lessonId: props.lessonId,
      fileId: file.id,
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: file.name
    };
    ApiHelper.post("/downloads", [download], "LessonsApi");
    setShowPreview(true);
  };

  return result;
}
