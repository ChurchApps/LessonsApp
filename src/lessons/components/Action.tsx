import React from "react";
import { ActionInterface, ArrayHelper, ResourceInterface } from "../../helpers";
import ReactMarkdown from "react-markdown"

interface Props {
  action: ActionInterface,
  resources: ResourceInterface[]
}

export const Action: React.FC<Props> = (props) => {

  const getPlayLink = () => {
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources || [], "id", props.action.resourceId);
    const asset = (props.action.assetId && resource) ? ArrayHelper.getOne(resource?.assets || [], "id", props.action.assetId) : null;

    if (asset) return <><a href={resource.variants[0].file.contentPath}>{resource.name}</a>: <a href={asset.file.contentPath}>{asset.name}</a></>
    else if (resource) return <a href={resource.variants[0].file.contentPath}>{resource.name}</a>
    return props.action.content;
  }

  let result = <></>;

  switch (props.action.actionType) {
    case "Do":
      result = <ul className="actions"><li><ReactMarkdown>{props.action.content}</ReactMarkdown></li></ul>
      break;
    case "Say":
      result = <blockquote><p><ReactMarkdown>{props.action.content}</ReactMarkdown></p></blockquote>
      break;
    case "Play":
      result = <ul className="actions"><li>Play: {getPlayLink()}</li></ul>
      break;
  }

  return result;
}

