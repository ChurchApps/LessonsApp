import React from "react";
import { ResourceInterface, ArrayHelper, ActionInterface, VariantInterface, AssetInterface, UserHelper, ApiHelper, FileInterface, ExternalVideoInterface } from "@/utils";
import { VideoModal } from "../VideoModal";
import { MarkdownPreview } from "../index"
import Image from "next/image";
import { AnalyticsHelper, DateHelper } from "@/appBase/helpers";
import { CommonEnvironmentHelper } from "@/appBase/helpers/CommonEnvironmentHelper";

type Props = {
  action: ActionInterface;
  resources: ResourceInterface[];
  externalVideos: ExternalVideoInterface[];
  lessonId: string;
};

export function Action(props: Props) {
  const [showPreview, setShowPreview] = React.useState(false);

  const trackDownload = (variant: VariantInterface) => {
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources, "id", variant.resourceId);
    const action = resource.name + " - " + variant.name;
    const label = window.location.pathname;
    AnalyticsHelper.logEvent("Download", action, label);
    if (CommonEnvironmentHelper.GoogleAnalyticsTag !== "" && typeof(window)!=="undefined") gtag("event", "conversion", { send_to: "AW-427967381/iTZUCK6U7ZkYEJWHicwB" });
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
    AnalyticsHelper.logEvent("Download", action, label);
    if (CommonEnvironmentHelper.GoogleAnalyticsTag !== "" && typeof(window)!=="undefined") gtag("event", "conversion", { send_to: "AW-427967381/iTZUCK6U7ZkYEJWHicwB" });
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

  const trackAssetDownload = (asset: AssetInterface) => {
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources || [], "id", props.action.resourceId);
    const action = resource.name + " - " + asset.name;
    const label = window.location.pathname;
    AnalyticsHelper.logEvent("Download Asset", action, label);
    if (CommonEnvironmentHelper.GoogleAnalyticsTag !== "" && typeof(window)!=="undefined") gtag("event", "conversion", { send_to: "AW-427967381/iTZUCK6U7ZkYEJWHicwB" });
    const download = {
      lessonId: props.lessonId,
      fileId: asset.fileId,
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: "Asset - " + asset.name
    }
    ApiHelper.post("/downloads", [download], "LessonsApi");
  }

  const getPreviewData = () => {
    const result:{type:string, thumbnail:string, name:string, url:string, videoId:string, seconds:number, action:(e:React.MouseEvent) => void} = { type:"", thumbnail:"", name:"", url:"", videoId: "", seconds:0, action:() => {}};
    const video: ExternalVideoInterface = ArrayHelper.getOne(props.externalVideos || [], "id", props.action.externalVideoId);
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources || [], "id", props.action.resourceId);
    const asset = (props.action.assetId && resource) ? ArrayHelper.getOne(resource?.assets || [], "id", props.action.assetId) : null;
    if (asset) {
      result.type = "asset";
      result.url = asset?.file?.contentPath;
      result.name = resource?.name + ": " +  asset?.name;
      result.action = () => { trackAssetDownload(asset) };
      result.thumbnail = asset?.file?.thumbPath || asset?.file?.contentPath || "";
    } else if (resource) {
      result.type = "resource";
      result.url = resource.variants[0]?.file?.contentPath;
      result.name = resource.name;
      result.action = () => { trackDownload(resource.variants[0]) };
      result.thumbnail = resource?.variants[0]?.file?.thumbPath || resource?.variants[0]?.file?.contentPath || "";
    } else if (video) {
      result.type = "video";
      result.url = "https://vimeo.com/" + video.videoId;
      result.name = video.name;
      result.action = (e) => { e.preventDefault(); trackView(video); setShowPreview(true); };
      result.thumbnail = video.thumbnail;
      result.videoId = video.videoId;
      result.seconds = parseInt(video.seconds);
    }
    return result;
  }

  let result = <></>;

  switch (props.action.actionType) {
    case "Note":
      result = (<div className="note"><MarkdownPreview value={props.action.content} /></div>);
      break;
    case "Do":
      result = (<ul className="actions"><li><MarkdownPreview value={props.action.content} /></li></ul>);
      break;
    case "Say":
      result = (<div className="say"><MarkdownPreview value={props.action.content} /></div>);
      break;
    case "Play":
      const data = getPreviewData();
      let duration = null;
      if (data.seconds>0) {
        const min = Math.floor(data.seconds / 60);
        const sec = data.seconds % 60;
        duration = <span className="duration">{min.toString() + ":" + sec.toString().padStart(2, "0") }</span>;
      }
      result = (<div className="playAction">
        {duration}
        <Image src={data.thumbnail} alt={data.name} width={128} height={72} style={{height:72}} />
        <a href={data.url} rel="noopener noreferrer" onClick={data.action} className="text">{data.name}</a>
        {data.type==="video" && showPreview && <VideoModal onClose={() => setShowPreview(false)} vimeoId={data.videoId} />}
      </div>);
      break;
  }

  return result;
}
