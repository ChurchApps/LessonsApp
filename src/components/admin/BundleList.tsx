import React, { useState } from "react";
import { ApiHelper, ResourceInterface, AssetInterface, VariantInterface, ArrayHelper, BundleInterface, ExternalVideoInterface } from "@/helpers";
import { DisplayBox, Loading, SmallButton } from "@churchapps/apphelper";
import { VariantEdit } from "./VariantEdit";
import { ResourceEdit } from "./ResourceEdit";
import { AssetEdit } from "./AssetEdit";
import { BundleEdit } from "./BundleEdit";
import { BulkAssetAdd } from "./BulkAssetAdd";
import { Accordion, AccordionDetails, AccordionSummary, Icon, Menu, MenuItem } from "@mui/material";
import { ExternalVideoEdit } from "./ExternalVideoEdit";

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
  const [externalVideos, setExternalVideos] = React.useState<ExternalVideoInterface[]>(null);
  const [editVideo, setEditVideo] = React.useState<ExternalVideoInterface>(null);
  const [editBundle, setEditBundle] = React.useState<BundleInterface>(null);
  const [editResource, setEditResource] = React.useState<ResourceInterface>(null);
  const [editVariant, setEditVariant] = React.useState<VariantInterface>(null);
  const [editAsset, setEditAsset] = React.useState<AssetInterface>(null);
  const [bulkResourceId, setBulkResourceId] = React.useState<string>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | any>(null);
  const [menuResourceId, setMenuResourceId] = React.useState<string>(null);
  const [videoMenuAnchor, setVideoMenuAnchor] = useState<null | any>(null);
  const [expandedBundleId, setExpandedBundleId] = useState<string>("");
  const [expandedResourceId, setExpandedResourceId] = useState<string>("");

  const clearEdits = () => {
    setEditResource(null);
  };

  const loadData = async () => {
    if (props.contentType && props.contentId) {
      ApiHelper.get("/externalVideos/content/" + props.contentType + "/" + props.contentId, "LessonsApi").then(data => setExternalVideos(data));
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
        const resource = r;
        result.push(<Accordion expanded={expandedResourceId === r.id} onChange={() => { setExpandedResourceId((expandedResourceId === resource.id) ? "" : resource.id); }} elevation={0}>
          <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header">
            <div style={{ width: "100%", paddingRight: 20 }}>
              <span style={{ float: "right" }}>
                {getDropDownMenu(resource.id)}
              </span>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditResource(resource); }}>
                <Icon>insert_drive_file</Icon> {r.name}
              </a>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {getVariants(resource.id)}
            {getAssets(resource.id)}
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
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditVariant(v); }}>
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
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditAsset(a); }}>
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
        <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header">
          <div style={{ width: "100%", paddingRight: 20 }}>
            <span style={{ float: "right" }}>
              <SmallButton icon="add" onClick={() => { setEditResource({ category: bundle.name, bundleId: bundle.id, loopVideo: false }); }} text="Resource" />
            </span>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditBundle(b); }} color="error">
              <Icon style={{ paddingTop: 4 }}>folder_zip</Icon> {b.name}
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

  const getVideos = () => {
    const result: JSX.Element[] = [];
    externalVideos.forEach(v => {
      const video = v;
      result.push(<div style={{ paddingLeft: 16 }}>
        <a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditVideo(video); }}>
          <Icon style={{ paddingTop: 4 }}>videocam</Icon> {video.name}
        </a>
      </div>)
    });
    return result;
  }

  const getAccordion = () => {
    if (resources === null) return <Loading />;
    else if (bundles?.length > 0 || externalVideos?.length > 0) return (
      <>
        <div className="adminAccordion">
          {getBundles()}
          {getVideos()}
        </div>
      </>
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
    else {
      setEditAsset(null);
      setMenuAnchor(null);
    }
    loadData();
  };

  const handleBulkAssetCallback = () => {
    setBulkResourceId(null);
    setMenuAnchor(null);
    loadData();
  };

  const getDropDownMenu = (resourceId: string) => (
    <>
      <SmallButton icon="add" text="Add" onClick={(e) => { setMenuResourceId(resourceId); setMenuAnchor(e.currentTarget); }} />
      {(menuResourceId === resourceId)
          && <Menu id={"addMenu" + resourceId} anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null) }} MenuListProps={{ "aria-labelledby": "addMenuButton" }}>
            <MenuItem onClick={() => { setEditVariant({ resourceId: resourceId, hidden: false }); }}><Icon>file_copy</Icon> Add Variant (for download/player)</MenuItem>
            <MenuItem onClick={() => { createAsset(resourceId); }}><Icon>format_list_numbered</Icon> Add Asset (for player only)</MenuItem>
            <MenuItem onClick={() => { bulkCreateAsset(resourceId); }}><Icon>format_list_numbered</Icon> Bulk Add Asset</MenuItem>
          </Menu>
      }
    </>
  );

  const getBundleVideoMenu = () => (
    <>
      <SmallButton icon="add" onClick={(e) => setVideoMenuAnchor(e.currentTarget)} />
      <Menu id="addMenu" anchorEl={videoMenuAnchor} open={Boolean(videoMenuAnchor)} onClose={() => { setVideoMenuAnchor(null) }} MenuListProps={{ "aria-labelledby": "addMenuButton" }}>
        <MenuItem onClick={() => { setEditBundle({ contentType: props.contentType, contentId: props.contentId }); }}><Icon>folder_zip</Icon> Add Bundle</MenuItem>
        <MenuItem onClick={() => { setEditVideo({ contentType: props.contentType, contentId: props.contentId, videoProvider: "Vimeo" }); }}><Icon>videocam</Icon> Add External Video (Beta)</MenuItem>
      </Menu>
    </>
  );


  const getEditContent = () =>
    //return (<SmallButton icon="add" onClick={() => { setEditBundle({ contentType: props.contentType, contentId: props.contentId }); }} />);
    getBundleVideoMenu()
  ;

  React.useEffect(() => { loadData() }, [props.contentType, props.contentId]);

  if (editVariant) return (<VariantEdit variant={editVariant} updatedCallback={() => { setEditVariant(null); setMenuAnchor(null); loadData(); }} />);
  if (editAsset) return (<AssetEdit asset={editAsset} updatedCallback={handleAssetCallback} />);
  if (bulkResourceId) return (<BulkAssetAdd resourceId={bulkResourceId} updatedCallback={handleBulkAssetCallback} />);
  if (editResource) return (<ResourceEdit resource={editResource} contentDisplayName={props.contentDisplayName} updatedCallback={() => { setEditResource(null); loadData(); }} />);
  if (editBundle) return (<BundleEdit bundle={editBundle} contentDisplayName={props.contentDisplayName} updatedCallback={() => { setEditBundle(null); loadData(); }} />);
  if (editVideo) return (<ExternalVideoEdit externalVideo={editVideo} contentDisplayName={props.contentDisplayName} updatedCallback={() => { setEditVideo(null); loadData(); }} />);
  else
    return (
      <>
        <DisplayBox id="resourcesBox" headerText={props.contentDisplayName} headerIcon="folder_zip" editContent={getEditContent()}>
          {getAccordion()}
        </DisplayBox>
      </>
    );
};
