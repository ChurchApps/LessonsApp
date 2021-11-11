import ReactMarkdown from "react-markdown";
import { ResourceInterface, ArrayHelper, ActionInterface, GoogleAnalyticsHelper, VariantInterface, AssetInterface } from "@/utils";

type Props = {
  action: ActionInterface;
  resources: ResourceInterface[];
};

export function Action(props: Props) {


  const trackDownload = (variant: VariantInterface) => {
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources, "id", variant.resourceId);
    const action = resource.name + " - " + variant.name;
    const label = window.location.pathname;
    GoogleAnalyticsHelper.gaEvent({ category: "Download", action: action, label: label })
  }

  const trackAssetDownload = (asset: AssetInterface) => {
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources || [], "id", props.action.resourceId);
    const action = resource.name + " - " + asset.name;
    const label = window.location.pathname;
    GoogleAnalyticsHelper.gaEvent({ category: "Download Asset", action: action, label: label })
  }


  const getPlayLink = () => {
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources || [], "id", props.action.resourceId);
    const asset = (props.action.assetId && resource) ? ArrayHelper.getOne(resource?.assets || [], "id", props.action.assetId) : null;

    if (asset)
      return (<>
        <a href={resource.variants[0]?.file?.contentPath} target="_blank" rel="noopener noreferrer" onClick={() => { trackDownload(resource.variants[0]) }} >{resource.name}</a>
        :{" "}
        <a href={asset?.file?.contentPath} target="_blank" rel="noopener noreferrer" onClick={() => { trackAssetDownload(asset) }} >{asset.name}</a>
      </>);
    else if (resource) return (<a href={resource.variants[0]?.file?.contentPath} target="_blank" rel="noopener noreferrer" onClick={() => { trackDownload(resource.variants[0]) }} > {resource.name} </a>);
    return props.action.content;
  };

  let result = <></>;

  switch (props.action.actionType) {
    case "Note":
      result = (<div className="note"><b>Note:</b> <ReactMarkdown>{props.action.content}</ReactMarkdown></div>);
      break;
    case "Do":
      result = (<ul className="actions"><li><ReactMarkdown>{props.action.content}</ReactMarkdown></li></ul>);
      break;
    case "Say":
      result = (<blockquote><ReactMarkdown>{props.action.content}</ReactMarkdown></blockquote>);
      break;
    case "Play":
      result = (<ul className="play"><li><b>Play:</b> {getPlayLink()}</li></ul>);
      break;
  }

  return result;
}
