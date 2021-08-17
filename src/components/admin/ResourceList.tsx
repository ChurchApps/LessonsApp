import React from "react";
import { ApiHelper, ResourceInterface, AssetInterface, VariantInterface, ArrayHelper } from "@/utils";
import { DisplayBox, Loading } from "../index";
import { VariantEdit } from "./VariantEdit";
import { ResourceEdit } from "./ResourceEdit";
import { AssetEdit } from "./AssetEdit";

interface Props {
  contentType: string;
  contentId: string;
}

export const ResourceList: React.FC<Props> = (props) => {
  const [resources, setResources] = React.useState<ResourceInterface[]>(null);
  const [assets, setAssets] = React.useState<AssetInterface[]>(null);
  const [variants, setVariants] = React.useState<VariantInterface[]>(null);
  const [editResource, setEditResource] = React.useState<ResourceInterface>(null);
  const [editVariant, setEditVariant] = React.useState<VariantInterface>(null);
  const [editAsset, setEditAsset] = React.useState<AssetInterface>(null);

  const clearEdits = () => {
    setEditResource(null);
  };

  const loadData = () => {
    if (props.contentType && props.contentId) {
      ApiHelper.get("/resources/content/" + props.contentType + "/" + props.contentId, "LessonsApi")
        .then((data: ResourceInterface[]) => {
          setResources(data);
          if (data.length === 0) {
            setAssets([]);
            setVariants([]);
          } else {
            ApiHelper.get("/assets/content/" + props.contentType + "/" + props.contentId, "LessonsApi")
              .then((data: any) => { setAssets(data); });
            ApiHelper.get("/variants/content/" + props.contentType + "/" + props.contentId, "LessonsApi")
              .then((data: any) => { setVariants(data); });
          }
        });
    }
  };

  const getVariants = (resourceId: string) => {
    const result: JSX.Element[] = [];
    if (variants) {
      ArrayHelper.getAll(variants, "resourceId", resourceId).forEach((v) => {
        result.push(
          <tr className="variantRow">
            <td colSpan={2}>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditVariant(v); }} >
                <i className="fas fa-copy"></i> {v.name}
              </a>
            </td>
          </tr>
        );
      });
    }
    return result;
  };

  const getAssets = (resourceId: string) => {
    const result: JSX.Element[] = [];
    if (assets) {
      ArrayHelper.getAll(assets, "resourceId", resourceId).forEach((a) => {
        result.push(
          <tr className="assetRow">
            <td colSpan={2}>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditAsset(a); }} >
                <i className="fas fa-list-ol"></i> {a.name}
              </a>
            </td>
          </tr>
        );
      });
    }
    return result;
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    resources.forEach((r) => {
      result.push(
        <tr className="resourceRow">
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditResource(r); }} >
              <i className="fas fa-file-alt"></i> {r.name}
            </a>
          </td>
          <td>
            <a id={"addBtnGroup_" + r.id} data-cy="add-button" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="about:blank" >
              <i className="fas fa-plus"></i>
            </a>
            {getDropDownMenu(r.id)}
          </td>
        </tr>
      );
      getVariants(r.id).forEach((v: any) => result.push(v));
      getAssets(r.id).forEach((a: any) => result.push(a));
    });
    return result;
  };

  const getTable = () => {
    if (resources === null) return <Loading />;
    else return (
      <table className="table table-sm table-borderless" id="resourceTree">
        <tbody>{getRows()}</tbody>
      </table>
    );
  };

  const createAsset = (resourceId: string) => {
    const resourceAssets = ArrayHelper.getAll(assets || [], "resourceId", resourceId);
    setEditAsset({ resourceId: resourceId, sort: resourceAssets?.length + 1 || 1, });
  };

  const handleAssetCallback = (asset: AssetInterface) => {
    if (asset.id && !editAsset.id) createAsset(asset.resourceId);
    else setEditAsset(null);
    loadData();
  };

  const getDropDownMenu = (resourceId: string) => {
    return (
      <div className="dropdown-menu" aria-labelledby={"addBtnGroup_" + resourceId} >
        <a className="dropdown-item" data-cy="add-variant" href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditVariant({ resourceId: resourceId }); }} >
          <i className="fas fa-copy"></i> Add Variant
        </a>
        <a className="dropdown-item" data-cy="add-asset" href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); createAsset(resourceId); }} >
          <i className="fas fa-list-ol"></i> Add Asset
        </a>
      </div>
    );
  };

  const getEditContent = () => {
    return (
      <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditResource({ contentType: props.contentType, contentId: props.contentId, }); }} >
        <i className="fas fa-plus"></i>
      </a>
    );
  };

  React.useEffect(loadData, [props.contentType, props.contentId]);

  if (editVariant)
    return (
      <VariantEdit
        variant={editVariant}
        updatedCallback={() => {
          setEditVariant(null);
          loadData();
        }}
      />
    );
  if (editAsset) return (<AssetEdit asset={editAsset} updatedCallback={handleAssetCallback} />);
  if (editResource) return (<ResourceEdit resource={editResource} updatedCallback={() => { setEditResource(null); loadData(); }} />);
  else
    return (
      <>
        <DisplayBox headerText="Resources" headerIcon="fas fa-file-alt" editContent={getEditContent()} >
          {getTable()}
        </DisplayBox>
      </>
    );
};
