import React from "react";
import { ResourceInterface, ArrayHelper, ActionInterface, VariantInterface, AssetInterface, UserHelper, ApiHelper, ExternalVideoInterface } from "@/utils";
import { MarkdownPreview, AnalyticsHelper, CommonEnvironmentHelper } from "@churchapps/apphelper"

type Props = {
  action: ActionInterface;
  resources: ResourceInterface[];
  externalVideos: ExternalVideoInterface[];
  lessonId: string;
};

export function ActionAlt(props: Props) {
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
    AnalyticsHelper.logEvent("Preview", action, label);
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

  const getPlayLink = () => {
    const video: ExternalVideoInterface = ArrayHelper.getOne(props.externalVideos || [], "id", props.action.externalVideoId);
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources || [], "id", props.action.resourceId);
    const asset = (props.action.assetId && resource) ? ArrayHelper.getOne(resource?.assets || [], "id", props.action.assetId) : null;

    if (asset) {
      return asset.name;
      /*
      return (<>
        <a href={resource.variants[0]?.file?.contentPath} target="_blank" rel="noopener noreferrer" onClick={() => { trackDownload(resource.variants[0]) }}>{resource.name}</a>
        :{" "}
        <a href={asset?.file?.contentPath} target="_blank" rel="noopener noreferrer" onClick={() => { trackAssetDownload(asset) }}>{asset.name}</a>
      </>);*/
    } else if (resource) {
      return resource.name;
      return (<>
        <a href={resource.variants[0]?.file?.contentPath} target="_blank" rel="noopener noreferrer" onClick={() => { trackDownload(resource.variants[0]) }}> {resource.name} </a>
      </>);
    } else if (video) {
      return video.name;
      return (<>
        <a href={"https://vimeo.com/" + video.videoId} rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); trackView(video); setShowPreview(true); }}>{video.name}</a>
      </>);
    }
    return props.action.content;
  };

  let result = <></>;

  switch (props.action.actionType) {
    case "Note":
      result = (<div className="note" style={{marginBottom:20}}><MarkdownPreview value={props.action.content} /></div>);
      break;
    case "Do":
      result = (<ul className="actions"><li><MarkdownPreview value={props.action.content} /></li></ul>);
      break;
    case "Say":
      result = (<blockquote style={{marginInlineStart:0}}><MarkdownPreview value={props.action.content} /></blockquote>);
      break;
    case "Play":
      //result = (<ul className="play"><li><b>Play:</b> {getPlayLink()}</li></ul>);
      result = <p style={{color:"#777", fontSize:12}}><i><b>Play: </b>{getPlayLink()}</i></p>;
      break;
  }

  return result;
}
