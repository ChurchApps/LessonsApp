import React from "react";
import { DisplayBox, ApiHelper, ResourceInterface, Loading, ResourceEdit } from "."
import { Link } from "react-router-dom"

interface Props { contentType: string, contentId: string }

export const ResourceList: React.FC<Props> = (props) => {
  const [resources, setResources] = React.useState<ResourceInterface[]>(null);
  const [editResource, setEditResource] = React.useState<ResourceInterface>(null);

  const loadData = () => {
    if (props.contentType && props.contentId) ApiHelper.get("/resources/content/" + props.contentType + "/" + props.contentId, "LessonsApi").then((data: ResourceInterface[]) => { setResources(data); });
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    resources.forEach(v => {
      result.push(<tr className="resourceRow">
        <td><i className="fas fa-file-alt"></i> <Link to={"/admin/resource/" + v.id}>{v.name}</Link></td>
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); setEditResource(v); }}><i className="fas fa-pencil-alt"></i></a></td>
      </tr>);
    });
    return result;
  }

  const getTable = () => {
    if (resources === null) return <Loading />
    else return (
      <table className="table">
        <tbody>
          {getRows()}
        </tbody>
      </table>
    )
  }


  const getEditContent = () => {
    return (<a href="about:blank" onClick={(e) => { e.preventDefault(); setEditResource({ contentType: props.contentType, contentId: props.contentId }) }}><i className="fas fa-plus"></i></a>);
  }

  React.useEffect(loadData, [props.contentType, props.contentId]);

  if (editResource) return <ResourceEdit resource={editResource} updatedCallback={() => { setEditResource(null); loadData() }} />
  else return (<>
    <DisplayBox headerText="Resources" headerIcon="fas fa-file-alt" editContent={getEditContent()} >
      {getTable()}
    </DisplayBox>
  </>);
}
