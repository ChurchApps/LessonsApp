import React from "react";
import { ActionInterface, ArrayHelper, ResourceInterface, RoleInterface } from "../../helpers";
import ReactMarkdown from "react-markdown"

interface Props {
  role: RoleInterface,
  action: ActionInterface,
  resources: ResourceInterface[]
}

export const ActionAlt: React.FC<Props> = (props) => {

  const getPlayLink = () => {
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources || [], "id", props.action.resourceId);
    const asset = (props.action.assetId && resource) ? ArrayHelper.getOne(resource?.assets || [], "id", props.action.assetId) : null;

    if (asset) return <><a href={resource.variants[0]?.file.contentPath}>{resource.name}</a>: <a href={asset.file.contentPath}>{asset.name}</a></>
    else if (resource) return <a href={resource.variants[0]?.file.contentPath}>{resource.name}</a>
    return props.action.content;
  }

  let result = <></>;

  switch (props.action.actionType) {
    case "Note":
      result = <div className="note"><b>Note:</b> {props.action.content}</div>
      break;
    case "Do":
      result = <ul className="actions"><li><ReactMarkdown>{"**" + props.role.name + ":** " + props.action.content}</ReactMarkdown></li></ul>
      break;
    case "Say":
      result = <blockquote><ReactMarkdown>{"**" + props.role.name + ":** " + props.action.content}</ReactMarkdown></blockquote>
      break;
    case "Play":
      result = <ul className="actions"><li><b>Play:</b> {getPlayLink()}</li></ul>
      break;
  }

  return result;
}

