import { useEffect, useState } from "react";
import { Box, Button, FormControl, IconButton, InputLabel, ListSubheader, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { Check as CheckIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { MarkdownEditor } from "@churchapps/apphelper-markdown";
import { ActionInterface,
  AddOnInterface,
  ApiHelper,
  ArrayHelper,
  AssetInterface,
  ExternalVideoInterface,
  ResourceInterface } from "@/helpers";

interface Props {
  action: ActionInterface;
  lessonVideos: ExternalVideoInterface[];
  studyVideos: ExternalVideoInterface[];
  programVideos: ExternalVideoInterface[];
  lessonResources: ResourceInterface[];
  studyResources: ResourceInterface[];
  programResources: ResourceInterface[];
  allAssets: AssetInterface[];
  addOns: AddOnInterface[];
  updatedCallback: (action: ActionInterface, created: boolean) => void;
}

export function ActionEdit(props: Props) {
  const [action, setAction] = useState<ActionInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(action, false);

  const getCombinedResources = () => {
    let result: ResourceInterface[] = [...props.lessonResources, ...props.studyResources, ...props.programResources];
    return result;
  };

  const getCombinedVideos = () => {
    let result: ExternalVideoInterface[] = [...props.lessonVideos, ...props.studyVideos, ...props.programVideos];
    return result;
  };

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleMarkdownChange = (newValue: string) => {
    let a = { ...action };
    a.content = newValue;
    setAction(a);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let a = { ...action };
    switch (e.target.name) {
    case "sort":
      a.sort = parseInt(e.target.value);
      break;
    case "actionType":
      a.actionType = e.target.value;
      break;
    case "content":
      a.content = e.target.value;
      break;
    case "resource":
      if (e.target.value.startsWith("ev/")) {
        a.resourceId = null;
        a.assetId = null;
        a.externalVideoId = e.target.value.replace("ev/", "");
        const video = ArrayHelper.getOne(getCombinedVideos(), "id", a.externalVideoId);
        a.content = video.name;
      } else {
        a.resourceId = e.target.value;
        a.assetId = null;
        a.externalVideoId = null;
        const resource = ArrayHelper.getOne(getCombinedResources(), "id", a.resourceId);
        a.content = resource.name;
      }
      break;
    case "asset":
      a.assetId = e.target.value;
      if (a.assetId === "") a.assetId = null;
      const assetResource = ArrayHelper.getOne(getCombinedResources(), "id", a.resourceId);
      const asset = ArrayHelper.getOne(props.allAssets, "id", a.assetId);
      a.content = asset ? assetResource.name + " - " + asset.name : assetResource?.name;
      break;
    case "addOn":
      a.addOnId = e.target.value;
      if (a.addOnId === "") a.addOnId = null;
      const addOn = ArrayHelper.getOne(props.addOns, "id", a.addOnId);
      a.content = addOn.name;
      break;
    }
    setAction(a);
  };

  const validate = () => {
    let errors = [];
    if (action.content === "") errors.push("Please enter content text.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const a = action;
      if (!a.actionType) a.actionType = "Say";
      if (a.actionType !== "Play" && a.actionType !== "Download") {
        a.resourceId = null;
        a.assetId = null;
      } else {
        if (a.resourceId === null && a.externalVideoId === null) {
          if (props.lessonResources.length > 0) a.resourceId = props.lessonResources[0].id;
          else if (props.studyResources.length > 0) a.resourceId = props.studyResources[0].id;
          else if (props.programResources.length > 0) a.resourceId = props.programResources[0].id;
        }
      }

      ApiHelper.post("/actions", [a], "LessonsApi").then((data: ActionInterface[]) => {
        setAction(data[0]);
        props.updatedCallback(data[0], !props.action.id);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this action?")) ApiHelper.delete("/actions/" + action.id.toString(), "LessonsApi").then(() => props.updatedCallback(null, false));
  };

  const getContent = () => {
    if (action.actionType !== "Play" && action.actionType !== "Download" && action.actionType !== "Add-on") return <MarkdownEditor value={action.content} onChange={handleMarkdownChange} />;
  };

  const getAsset = () => {
    if (props.allAssets && action?.resourceId) {
      const assets = ArrayHelper.getAll(props.allAssets, "resourceId", action.resourceId);
      if (assets.length > 0) {
        const assetItems: JSX.Element[] = [];
        assets.forEach((a: AssetInterface) => assetItems.push(<MenuItem value={a.id}>{a.name}</MenuItem>));

        return (
          <FormControl fullWidth>
            <InputLabel>Asset</InputLabel>
            <Select label="Asset" name="asset" value={action.assetId || ""} onChange={handleChange}>
              <MenuItem value="">All</MenuItem>
              {assetItems}
            </Select>
          </FormControl>
        );
      }
    }
  };

  const getResource = () => {
    if (action.actionType === "Play" || action.actionType === "Download") {
      if (props.lessonResources && props.studyResources && props.programResources) {
        let currentValue = action.resourceId;
        if (!currentValue && action.externalVideoId) currentValue = "ev/" + action.externalVideoId;
        return (
          <>
            <FormControl fullWidth>
              <InputLabel>Resource</InputLabel>
              <Select label="Resource" name="resource" id="resourceSelect" value={currentValue} onChange={handleChange}>
                {getResourceGroup("Lesson", props.lessonResources, props.lessonVideos)}
                {getResourceGroup("Study", props.studyResources, props.studyVideos)}
                {getResourceGroup("Program", props.programResources, props.programVideos)}
              </Select>
            </FormControl>

            {getAsset()}
          </>
        );
      }
    }
  };

  const getResourceGroup = (groupName: string, resources: ResourceInterface[], videos: ExternalVideoInterface[]) => {
    if (resources.length > 0 || videos.length > 0) {
      const items: JSX.Element[] = [];
      items.push(<ListSubheader>{groupName}</ListSubheader>);
      resources.forEach(r => {
        items.push(<MenuItem value={r.id}>{r.name}</MenuItem>);
      });
      videos.forEach(v => {
        items.push(<MenuItem value={"ev/" + v.id}>{v.name}</MenuItem>);
      });
      return items;
    }
  };

  const updateResource = () => {
    if (action?.actionType === "Play" || action?.actionType === "Download") {
      if (action.resourceId) {
        let resources: ResourceInterface[] = getCombinedResources();
        if (resources.length > 0) {
          if (ArrayHelper.getOne(resources, "id", action.resourceId) === null) {
            let a = { ...action };
            a.resourceId = resources[0].id;
            a.content = resources[0].name;
            a.assetId = null;
            a.addOnId = null;
            setAction(a);
          }
        }
      }
    }
  };

  const getAddOn = () => {
    if (action.actionType === "Add-on") {
      if (props.addOns.length > 0) {
        let currentValue = action.addOnId;
        return (
          <>
            <FormControl fullWidth>
              <InputLabel>Add-on</InputLabel>
              <Select label="Add-on" name="addOn" value={currentValue} onChange={handleChange}>
                {props.addOns.map(a => (
                  <MenuItem value={a.id}>{a.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {getAsset()}
          </>
        );
      }
    }
  };

  const updateAddOn = () => {
    if (action?.actionType === "Add-on") {
      if (action.addOnId) {
        if (props.addOns.length > 0) {
          if (ArrayHelper.getOne(props.addOns, "id", action.id) === null) {
            let a = { ...action };
            a.addOnId = props.addOns[0].id;
            a.content = props.addOns[0].name;
            a.assetId = null;
            a.resourceId = null;
            setAction(a);
          }
        }
      }
    }
  };

  useEffect(() => {
    setAction(props.action);
    setTimeout(() => {
      updateResource();
      updateAddOn();
    }, 500);
  }, [props.action]);

  if (!action) {
    return <></>;
  } else {
    return (
      <Paper
        sx={{
          borderRadius: 2,
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)',
          overflow: 'hidden'
        }}>
        {/* HEADER */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid var(--admin-border)',
            backgroundColor: 'var(--c1l7)'
          }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckIcon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
            <Typography variant="h6" sx={{
              color: 'var(--c1d2)',
              fontWeight: 600,
              lineHeight: 1,
              fontSize: '1.25rem'
            }}>
              {action?.id ? "Edit Action" : "Create Action"}
            </Typography>
          </Stack>
        </Box>

        {/* CONTENT */}
        <Box sx={{ p: 3 }}>
          <ErrorMessages errors={errors} />

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Order"
              type="number"
              name="sort"
              value={action.sort || ''}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="1"
              helperText="Display order for this action within the role"
            />

            <FormControl fullWidth>
              <InputLabel>Action Type</InputLabel>
              <Select label="Action Type" name="actionType" value={action.actionType} onChange={handleChange}>
                <MenuItem value="Say" key="Say">
                  Say
                </MenuItem>
                <MenuItem value="Do" key="Do">
                  Do
                </MenuItem>
                <MenuItem value="Play" key="Play">
                  Play
                </MenuItem>
                <MenuItem value="Download" key="Download">
                  Download
                </MenuItem>
                <MenuItem value="Note" key="Note">
                  Note
                </MenuItem>
                <MenuItem value="Add-on" key="Add-on">
                  Add-on
                </MenuItem>
              </Select>
            </FormControl>

            {getContent()}
            {getResource()}
            {getAddOn()}
          </Stack>
        </Box>

        {/* FOOTER */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid var(--admin-border)',
            backgroundColor: 'var(--admin-bg)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            flexWrap: 'wrap'
          }}>
          <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          {action.id && (
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Paper>
    );
  }
}
