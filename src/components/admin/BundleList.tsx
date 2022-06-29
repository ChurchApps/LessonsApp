import React, { useState } from "react";
import { ApiHelper, ResourceInterface, AssetInterface, VariantInterface, ArrayHelper, BundleInterface } from "@/utils";
import { DisplayBox, Loading } from "../index";
import { VariantEdit } from "./VariantEdit";
import { ResourceEdit } from "./ResourceEdit";
import { AssetEdit } from "./AssetEdit";
import { BundleEdit } from "./BundleEdit";
import { BulkAssetAdd } from "./BulkAssetAdd";
import { Accordion, AccordionDetails, AccordionSummary, Icon, Menu, MenuItem } from "@mui/material";
import { SmallButton } from "@/appBase/components";

interface Props {
  contentType: string;
  contentId: string;
  contentDisplayName: string;
}

export const BundleList: React.FC<Props> = (props) => {
  const [bundles, setBundles] = React.useState<BundleInterface[]>(null);
  const [resources, setResources] = React.useState<ResourceInterface[]>(null);
  const [assets, setAssets] = React.useState<AssetInterface[]>(null);
  const [variants, setVariants] = React.useState<VariantInterface[]>(null);
  const [editBundle, setEditBundle] = React.useState<BundleInterface>(null);
  const [editResource, setEditResource] = React.useState<ResourceInterface>(null);
  const [editVariant, setEditVariant] = React.useState<VariantInterface>(null);
  const [editAsset, setEditAsset] = React.useState<AssetInterface>(null);
  const [bulkResourceId, setBulkResourceId] = React.useState<string>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | any>(null);
  const [expandedBundleId, setExpandedBundleId] = useState<string>("");
  const [expandedResourceId, setExpandedResourceId] = useState<string>("");

  const clearEdits = () => {
    setEditResource(null);
  };

  const loadData = async () => {
    if (props.contentType && props.contentId) {
      const bundleData: BundleInterface[] = await ApiHelper.get("/bundles/content/" + props.contentType + "/" + props.contentId, "LessonsApi");
      setBundles(bundleData);
      if (bundleData.length === 0) {
        setResources([]);
        setAssets([]);
        setVariants([]);
      } else {
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
    }
  };


  const getResources = (bundleId: string) => {
    const result: JSX.Element[] = [];
    if (resources) {
      ArrayHelper.getAll(resources, "bundleId", bundleId).forEach((r) => {
        result.push(<Accordion expanded={expandedResourceId === r.id} onChange={() => { setExpandedResourceId((expandedResourceId === r.id) ? "" : r.id); }} elevation={0}>
          <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header" >
            <div style={{ width: "100%", paddingRight: 20 }}>
              <span style={{ float: "right" }}>
                {getDropDownMenu(r.id)}
              </span>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditResource(r); }} >
                <i className="fas fa-file-alt"></i> {r.name}
              </a>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {getVariants(r.id)}
            {getAssets(r.id)}
          </AccordionDetails>
        </Accordion>);
      });
    }
    return result;
  };

  const getVariants = (resourceId: string) => {
    const result: JSX.Element[] = [];
    if (variants) {
      ArrayHelper.getAll(variants, "resourceId", resourceId).forEach((v) => {
        result.push(
          <div className="variantDiv" key={`v-${v.id}`}>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditVariant(v); }} >
              <Icon>file_copy</Icon> {v.name}
            </a>
          </div>
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
          <div className="assetDiv" key={`a-${a.id}`}>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditAsset(a); }} >
              <Icon>format_list_numbered</Icon> {a.name}
            </a>
          </div>
        );
      });
    }
    return result;
  };

  const getBundles = () => {
    const result: JSX.Element[] = [];
    bundles.forEach(b => {
      const bundle = b;
      result.push(<Accordion expanded={expandedBundleId === b.id} onChange={() => { setExpandedBundleId((expandedBundleId === b.id) ? "" : b.id); }} elevation={0}>
        <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header" >
          <div style={{ width: "100%", paddingRight: 20 }}>
            <span style={{ float: "right" }}>
              <SmallButton icon="add" onClick={() => { setEditResource({ category: bundle.name, bundleId: bundle.id }); }} text="Resource" />
            </span>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditBundle(b); }} color="error">
              {b.name}
            </a>

          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="adminAccordion resourceAccordion">
            {getResources(b.id)}
          </div>
        </AccordionDetails>
      </Accordion>);

    });

    return result;
  };

  const getAccordion = () => {
    if (resources === null) return <Loading />;
    else if (bundles?.length > 0) return (
      <Accordion className="adminAccordion">
        {getBundles()}
      </Accordion>
    );
  };

  const createAsset = (resourceId: string) => {
    const resourceAssets = ArrayHelper.getAll(assets || [], "resourceId", resourceId);
    setEditAsset({ resourceId: resourceId, sort: resourceAssets?.length + 1 || 1, });
  };

  const bulkCreateAsset = (resourceId: string) => {
    const resourceAssets = ArrayHelper.getAll(assets || [], "resourceId", resourceId);
    setBulkResourceId(resourceId);
  };

  const handleAssetCallback = (asset: AssetInterface) => {
    if (asset && asset.id && !editAsset.id) createAsset(asset.resourceId);
    else setEditAsset(null);
    loadData();
  };

  const handleBulkAssetCallback = () => {
    setBulkResourceId(null);
    loadData();
  };

  const getDropDownMenu = (resourceId: string) => {
    return (
      <>
        <SmallButton icon="add" text="Add" onClick={(e) => setMenuAnchor(e.currentTarget)} />
        <Menu id="addMenu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null) }} MenuListProps={{ "aria-labelledby": "addMenuButton" }}>
          <MenuItem onClick={() => { setEditVariant({ resourceId: resourceId }); }} ><Icon>file_copy</Icon> Add Variant</MenuItem>
          <MenuItem onClick={() => { createAsset(resourceId); }} ><Icon>format_list_numbered</Icon> Add Asset</MenuItem>
          <MenuItem onClick={() => { bulkCreateAsset(resourceId); }} ><Icon>format_list_numbered</Icon> Bulk Add Asset</MenuItem>
        </Menu>
      </>
    );
  };


  const getEditContent = () => {
    return (<SmallButton icon="add" onClick={() => { setEditBundle({ contentType: props.contentType, contentId: props.contentId }); }} />);
  };

  React.useEffect(() => { loadData() }, [props.contentType, props.contentId]);

  if (editVariant) return (<VariantEdit variant={editVariant} updatedCallback={() => { setEditVariant(null); loadData(); }} />);
  if (editAsset) return (<AssetEdit asset={editAsset} updatedCallback={handleAssetCallback} />);
  if (bulkResourceId) return (<BulkAssetAdd resourceId={bulkResourceId} updatedCallback={handleBulkAssetCallback} />);
  if (editResource) return (<ResourceEdit resource={editResource} contentDisplayName={props.contentDisplayName} updatedCallback={() => { setEditResource(null); loadData(); }} />);
  if (editBundle) return (<BundleEdit bundle={editBundle} contentDisplayName={props.contentDisplayName} updatedCallback={() => { setEditBundle(null); loadData(); }} />);
  else
    return (
      <>
        <DisplayBox id="resourcesBox" headerText={props.contentDisplayName} headerIcon="fas fa-file-archive" editContent={getEditContent()} >
          {getAccordion()}
        </DisplayBox>
      </>
    );
};
