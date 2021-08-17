import ReactMarkdown from "react-markdown";
import {
  RoleInterface,
  ActionInterface,
  ResourceInterface,
  ArrayHelper,
} from "@/utils";

type Props = {
  role: RoleInterface;
  action: ActionInterface;
  resources: ResourceInterface[];
};

export function ActionAlt({ role, action, resources }: Props) {
  const getPlayLink = () => {
    const resource: ResourceInterface = ArrayHelper.getOne(
      resources || [],
      "id",
      action.resourceId
    );
    const asset =
      action.assetId && resource
        ? ArrayHelper.getOne(resource?.assets || [], "id", action.assetId)
        : null;

    if (asset)
      return (
        <>
          <a href={resource.variants[0]?.file.contentPath}>{resource.name}</a>:{" "}
          <a href={asset.file.contentPath}>{asset.name}</a>
        </>
      );
    else if (resource)
      return (
        <a href={resource.variants[0]?.file.contentPath}>{resource.name}</a>
      );
    return action.content;
  };

  let result = <></>;

  switch (action.actionType) {
    case "Note":
      result = (
        <div className="note">
          <b>Note:</b> {action.content}
        </div>
      );
      break;
    case "Do":
      result = (
        <ul className="actions">
          <li>
            <ReactMarkdown>
              {"**" + role.name + ":** " + action.content}
            </ReactMarkdown>
          </li>
        </ul>
      );
      break;
    case "Say":
      result = (
        <blockquote>
          <ReactMarkdown>
            {"**" + role.name + ":** " + action.content}
          </ReactMarkdown>
        </blockquote>
      );
      break;
    case "Play":
      result = (
        <ul className="actions">
          <li>
            <b>Play:</b> {getPlayLink()}
          </li>
        </ul>
      );
      break;
  }

  return result;
}
