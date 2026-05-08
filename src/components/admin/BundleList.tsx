import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Accordion, AccordionDetails, AccordionSummary, Box, Icon, IconButton, Menu, MenuItem, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { FileUpload as FilesIcon, Videocam as VideoIcon } from "@mui/icons-material";
import { Loading } from "@churchapps/apphelper";
import {
  ApiHelper,
  ArrayHelper,
  AssetInterface,
  BundleInterface,
  ExternalVideoInterface,
  ResourceInterface,
  VariantInterface
} from "@/helpers";

function formatBytes(bytes?: number): string {
  if (!bytes || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
import { AssetEdit } from "./AssetEdit";
import { BulkAssetAdd } from "./BulkAssetAdd";
import { BundleEdit } from "./BundleEdit";
import { ExternalVideoEdit } from "./ExternalVideoEdit";
import { ResourceEdit } from "./ResourceEdit";
import { VariantEdit } from "./VariantEdit";

interface Props {
  contentType: string;
  contentId: string;
  contentDisplayName: string;
}

export const BundleList: React.FC<Props> = props => {
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

  const clearEdits = () => { setEditResource(null); };

  const handleRebuildZip = async (bundleId: string) => {
    try {
      await ApiHelper.post("/bundles/" + bundleId + "/rezip", {}, "LessonsApi");
      alert("Zip rebuild queued. It may take a few minutes to complete.");
    } catch (err) {
      alert("Failed to queue zip rebuild.");
      console.error(err);
    }
  };

  const loadData = async () => {
    if (props.contentType && props.contentId) {
      ApiHelper.get("/externalVideos/content/" + props.contentType + "/" + props.contentId, "LessonsApi").then(data =>
        setExternalVideos(data));
      const bundleData: BundleInterface[] = await ApiHelper.get("/bundles/content/" + props.contentType + "/" + props.contentId, "LessonsApi");
      // Hydrate each bundle's zip file so we can show dateModified, size, and a download link.
      // The bundle endpoint doesn't join the file row, so we fetch them in parallel by id.
      await Promise.all(bundleData.map(async b => {
        if (b.fileId) {
          try {
            b.file = await ApiHelper.get("/files/" + b.fileId, "LessonsApi");
          } catch {
            // Missing file rows shouldn't block the rest of the list.
          }
        }
      }));
      setBundles(bundleData);
      if (bundleData.length === 0) {
        setResources([]);
        setAssets([]);
        setVariants([]);
      } else {
        ApiHelper.get("/resources/content/" + props.contentType + "/" + props.contentId, "LessonsApi").then((data: ResourceInterface[]) => {
          setResources(data);
          if (data.length === 0) {
            setAssets([]);
            setVariants([]);
          } else {
            ApiHelper.get("/assets/content/" + props.contentType + "/" + props.contentId, "LessonsApi").then((data: any) => { setAssets(data); });
            ApiHelper.get("/variants/content/" + props.contentType + "/" + props.contentId, "LessonsApi").then((data: any) => { setVariants(data); });
          }
        });
      }
    }
  };

  const getResources = (bundleId: string) => {
    const result: React.JSX.Element[] = [];
    if (resources) {
      ArrayHelper.getAll(resources, "bundleId", bundleId).forEach(r => {
        const resource = r;
        result.push(<Accordion
          expanded={expandedResourceId === r.id}
          onChange={() => { setExpandedResourceId(expandedResourceId === resource.id ? "" : resource.id); }}
          elevation={0}>
          <AccordionSummary
            expandIcon={<Icon>expand_more</Icon>}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <div style={{ width: "100%", paddingRight: 20 }}>
              <span style={{ float: "right" }}>{getDropDownMenu(resource.id)}</span>
              <a
                href="about:blank"
                onClick={e => {
                  e.preventDefault();
                  clearEdits();
                  setEditResource(resource);
                }}
                style={{
                  color: "var(--c1)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
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
    const result: React.JSX.Element[] = [];
    if (variants) {
      ArrayHelper.getAll(variants, "resourceId", resourceId).forEach(v => {
        result.push(<div className="variantDiv" key={`v-${v.id}`}>
          <a
            href="about:blank"
            onClick={e => {
              e.preventDefault();
              clearEdits();
              setEditVariant(v);
            }}
            style={{
              color: "var(--c1)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
            <Icon>file_copy</Icon> {v.name}
          </a>
        </div>);
      });
    }
    return result;
  };

  const getAssets = (resourceId: string) => {
    const result: React.JSX.Element[] = [];
    if (assets) {
      ArrayHelper.getAll(assets, "resourceId", resourceId).forEach(a => {
        result.push(<div className="assetDiv" key={`a-${a.id}`}>
          <a
            href="about:blank"
            onClick={e => {
              e.preventDefault();
              clearEdits();
              setEditAsset(a);
            }}
            style={{
              color: "var(--c1)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
            <Icon>format_list_numbered</Icon> {a.name}
          </a>
        </div>);
      });
    }
    return result;
  };

  const renderSectionHeader = (label: string, count: number) => (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mb: 1.5,
        pb: 0.75,
        borderBottom: "1px solid var(--admin-border-light)"
      }}>
      <Typography
        component="h3"
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          margin: 0
        }}>
        {label}
      </Typography>
      <Typography
        component="span"
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          color: "var(--c1d1)",
          background: "var(--c1l6)",
          borderRadius: 10,
          padding: "1px 8px"
        }}>
        {count}
      </Typography>
    </Stack>
  );

  const renderBundleStatus = (bundle: BundleInterface) => {
    const pending = !!bundle.pendingUpdate;
    const hasZip = !!bundle.fileId;
    const file = bundle.file;
    const zipBuiltAt = file?.dateModified ? new Date(file.dateModified) : null;
    const downloadUrl = file?.contentPath || null;
    const sizeBytes = file?.size;

    return (
      <Stack
        direction="row"
        alignItems="center"
        gap={1.25}
        flexWrap="wrap"
        sx={{ mt: 0.5, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
        {pending && (
          <Tooltip title="Queued for zip rebuild — usually completes within a few minutes." arrow>
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                padding: "1px 8px",
                borderRadius: 10,
                background: "#fff3e0",
                color: "#b26500",
                fontWeight: 600
              }}>
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", background: "#ed6c02" }} />
              Rebuild queued
            </Box>
          </Tooltip>
        )}
        {!pending && hasZip && (
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              padding: "1px 8px",
              borderRadius: 10,
              background: "#e8f5e9",
              color: "#2e7d32",
              fontWeight: 600
            }}>
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", background: "#2e7d32" }} />
            Zip ready
          </Box>
        )}
        {!pending && !hasZip && <span>No zip yet</span>}
        {zipBuiltAt && (
          <Tooltip title={zipBuiltAt.toLocaleString()} arrow>
            <span>Built {formatDistanceToNow(zipBuiltAt, { addSuffix: true })}</span>
          </Tooltip>
        )}
        {!!sizeBytes && <span>· {formatBytes(sizeBytes)}</span>}
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              color: "var(--c1)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4
            }}>
            <Icon fontSize="small" sx={{ fontSize: "0.95rem" }}>download</Icon>
            Download
          </a>
        )}
      </Stack>
    );
  };

  const getBundles = () => bundles.map(b => {
    const bundle = b;
    return (
      <Paper
        key={b.id}
        variant="outlined"
        sx={{
          borderRadius: 1.5,
          overflow: "hidden",
          background: "var(--admin-surface)"
        }}>
        <Accordion
          expanded={expandedBundleId === b.id}
          onChange={() => { setExpandedBundleId(expandedBundleId === b.id ? "" : b.id); }}
          elevation={0}
          disableGutters
          sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header">
            <div style={{ width: "100%", paddingRight: 20 }}>
              <span style={{ float: "right", display: "inline-flex", gap: 2 }}>
                <Tooltip title="Rebuild Zip" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleRebuildZip(bundle.id); }}
                    sx={{ color: "var(--text-secondary)", "&:hover": { color: "var(--c1)" } }}>
                    <Icon fontSize="small">refresh</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add Resource" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditResource({ category: bundle.name, bundleId: bundle.id, loopVideo: false });
                    }}
                    sx={{ color: "var(--text-secondary)", "&:hover": { color: "var(--c1)" } }}>
                    <Icon fontSize="small">add</Icon>
                  </IconButton>
                </Tooltip>
              </span>
              <a
                href="about:blank"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearEdits();
                  setEditBundle(b);
                }}
                style={{
                  color: "var(--c1)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                <Icon style={{ paddingTop: 4 }}>folder_zip</Icon> {b.name}
              </a>
              {renderBundleStatus(b)}
            </div>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: "1px solid var(--admin-border-light)", background: "var(--admin-bg-lighter)" }}>
            <div className="adminAccordion resourceAccordion">{getResources(b.id)}</div>
          </AccordionDetails>
        </Accordion>
      </Paper>
    );
  });

  const getVideos = () => externalVideos.map(v => {
    const video = v;
    return (
      <Paper
        key={v.id}
        variant="outlined"
        sx={{
          borderRadius: 1.5,
          padding: "10px 14px",
          background: "var(--admin-surface)"
        }}>
        <a
          href="about:blank"
          onClick={e => {
            e.preventDefault();
            clearEdits();
            setEditVideo(video);
          }}
          style={{
            color: "var(--c1)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}>
          <VideoIcon fontSize="small" /> {video.name}
        </a>
      </Paper>
    );
  });

  const getAccordion = () => {
    if (resources === null) return <Loading />;
    if (!bundles?.length && !externalVideos?.length) {
      return (
        <Box sx={{ p: 3, textAlign: "center", color: "var(--text-secondary)" }}>
          <Typography sx={{ fontSize: "0.875rem", mb: 0 }}>
            No bundles or videos yet.
          </Typography>
        </Box>
      );
    }
    return (
      <Stack spacing={3} className="adminAccordion">
        {bundles?.length > 0 && (
          <Box>
            {renderSectionHeader("Bundles", bundles.length)}
            <Stack spacing={1}>{getBundles()}</Stack>
          </Box>
        )}
        {externalVideos?.length > 0 && (
          <Box>
            {renderSectionHeader("External Videos", externalVideos.length)}
            <Stack spacing={1}>{getVideos()}</Stack>
          </Box>
        )}
      </Stack>
    );
  };

  const createAsset = (resourceId: string) => { const resourceAssets = ArrayHelper.getAll(assets || [], "resourceId", resourceId); setEditAsset({ resourceId: resourceId, sort: resourceAssets?.length + 1 || 1 }); };

  const bulkCreateAsset = (resourceId: string) => { const _resourceAssets = ArrayHelper.getAll(assets || [], "resourceId", resourceId); setBulkResourceId(resourceId); };

  const handleAssetCallback = (asset: AssetInterface) => {
    if (asset && asset.id && !editAsset.id) {
      createAsset(asset.resourceId);
    } else {
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
      <Tooltip title="Add Variant or Asset" arrow>
        <IconButton
          size="small"
          onClick={e => { e.stopPropagation(); setMenuResourceId(resourceId); setMenuAnchor(e.currentTarget); }}
          sx={{ color: "var(--text-secondary)", "&:hover": { color: "var(--c1)" } }}>
          <Icon fontSize="small">add</Icon>
        </IconButton>
      </Tooltip>
      {menuResourceId === resourceId && (
        <Menu
          id={"addMenu" + resourceId}
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => { setMenuAnchor(null); }}
          MenuListProps={{ "aria-labelledby": "addMenuButton" }}>
          <MenuItem
            onClick={() => {
              setEditVariant({ resourceId: resourceId, hidden: false });
            }}>
            <Icon>file_copy</Icon> Add Variant (for download/player)
          </MenuItem>
          <MenuItem
            onClick={() => { createAsset(resourceId); }}>
            <Icon>format_list_numbered</Icon> Add Asset (for player only)
          </MenuItem>
          <MenuItem
            onClick={() => { bulkCreateAsset(resourceId); }}>
            <Icon>format_list_numbered</Icon> Bulk Add Asset
          </MenuItem>
        </Menu>
      )}
    </>
  );

  const getBundleVideoMenu = () => (
    <>
      <Tooltip title="Add Bundle or External Video" arrow>
        <IconButton
          size="small"
          onClick={e => setVideoMenuAnchor(e.currentTarget)}
          sx={{ color: "var(--c1d2)", "&:hover": { color: "var(--c1)" } }}>
          <Icon fontSize="small">add</Icon>
        </IconButton>
      </Tooltip>
      <Menu
        id="addMenu"
        anchorEl={videoMenuAnchor}
        open={Boolean(videoMenuAnchor)}
        onClose={() => { setVideoMenuAnchor(null); }}
        MenuListProps={{ "aria-labelledby": "addMenuButton" }}>
        <MenuItem
          onClick={() => {
            setEditBundle({ contentType: props.contentType, contentId: props.contentId });
          }}>
          <Icon>folder_zip</Icon> Add Bundle
        </MenuItem>
        <MenuItem
          onClick={() => {
            setEditVideo({ contentType: props.contentType, contentId: props.contentId, videoProvider: "Vimeo" });
          }}>
          <Icon>videocam</Icon> Add External Video (Beta)
        </MenuItem>
      </Menu>
    </>
  );

  const getEditContent = () =>
    //return (<SmallButton icon="add" onClick={() => { setEditBundle({ contentType: props.contentType, contentId: props.contentId }); }} />);
    getBundleVideoMenu();
  React.useEffect(() => { loadData(); }, [props.contentType, props.contentId]);

  if (editVariant) {
    return (
      <VariantEdit
        variant={editVariant}
        updatedCallback={() => {
          setEditVariant(null);
          setMenuAnchor(null);
          loadData();
        }}
      />
    );
  }
  if (editAsset) return <AssetEdit asset={editAsset} updatedCallback={handleAssetCallback} />;
  if (bulkResourceId) return <BulkAssetAdd resourceId={bulkResourceId} updatedCallback={handleBulkAssetCallback} />;
  if (editResource) {
    return (
      <ResourceEdit
        resource={editResource}
        contentDisplayName={props.contentDisplayName}
        updatedCallback={() => { setEditResource(null); loadData(); }}
      />
    );
  }
  if (editBundle) {
    return (
      <BundleEdit
        bundle={editBundle}
        contentDisplayName={props.contentDisplayName}
        updatedCallback={() => { setEditBundle(null); loadData(); }}
      />
    );
  }
  if (editVideo) {
    return (
      <ExternalVideoEdit
        externalVideo={editVideo}
        contentDisplayName={props.contentDisplayName}
        updatedCallback={() => { setEditVideo(null); loadData(); }}
      />
    );
  } else {
    return (
      <>
        <Paper
          sx={{
            borderRadius: 2,
            border: "1px solid var(--admin-border)",
            boxShadow: "var(--admin-shadow-sm)",
            overflow: "hidden"
          }}>
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid var(--admin-border)",
              backgroundColor: "var(--c1l7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FilesIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
              <Typography
                variant="h6"
                sx={{
                  color: "var(--c1d2)",
                  fontWeight: 600,
                  lineHeight: 1,
                  fontSize: "1.25rem"
                }}>
                {props.contentDisplayName} Files
              </Typography>
            </Stack>
            {getEditContent()}
          </Box>

          <Box sx={{ p: 2 }}>
            {getAccordion()}
          </Box>
        </Paper>
      </>
    );
  }
};
