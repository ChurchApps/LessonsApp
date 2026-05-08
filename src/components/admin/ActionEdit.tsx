import { useEffect } from "react";
import { Alert, Box, Button, FormControl, IconButton, InputLabel, ListSubheader, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { Check as CheckIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { MarkdownEditor } from "@churchapps/apphelper/markdown";
import {
  ActionInterface,
  AddOnInterface,
  ApiHelper,
  ArrayHelper,
  AssetInterface,
  ExternalVideoInterface,
  ResourceInterface
} from "@/helpers";

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

type AnyRecord = Record<string, any>;

export function ActionEdit(props: Props) {
  const { register, handleSubmit, reset, control, watch, setValue, getValues, formState } = useForm<AnyRecord>({ defaultValues: { sort: "", actionType: "", content: "", resourceId: "", externalVideoId: "", assetId: "", addOnId: "" } });
  const e = formState.errors as any;
  const actionType = watch("actionType");
  const resourceId = watch("resourceId");
  const externalVideoId = watch("externalVideoId");
  const assetId = watch("assetId");
  const addOnId = watch("addOnId");
  const summaryErrors: string[] = [];
  if (e.content?.message) summaryErrors.push(e.content.message);

  const handleCancel = () => props.updatedCallback(props.action, false);

  const getCombinedResources = () => [...props.lessonResources, ...props.studyResources, ...props.programResources];
  const getCombinedVideos = () => [...props.lessonVideos, ...props.studyVideos, ...props.programVideos];

  const onValid = (values: AnyRecord) => {
    const a: ActionInterface = {
      ...props.action,
      sort: parseInt(values.sort) || 0,
      actionType: values.actionType || "Say",
      content: values.content,
      resourceId: values.resourceId || null,
      externalVideoId: values.externalVideoId || null,
      assetId: values.assetId || null,
      addOnId: values.addOnId || null
    };
    if (a.actionType !== "Play" && a.actionType !== "Download") {
      a.resourceId = null;
      a.assetId = null;
    } else if (a.resourceId === null && a.externalVideoId === null) {
      if (props.lessonResources.length > 0) a.resourceId = props.lessonResources[0].id;
      else if (props.studyResources.length > 0) a.resourceId = props.studyResources[0].id;
      else if (props.programResources.length > 0) a.resourceId = props.programResources[0].id;
    }
    ApiHelper.post("/actions", [a], "LessonsApi").then((data: ActionInterface[]) => props.updatedCallback(data[0], !props.action.id));
  };

  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this action?")) ApiHelper.delete("/actions/" + props.action.id.toString(), "LessonsApi").then(() => props.updatedCallback(null, false)); };

  const onResourceChange = (val: string) => {
    if (val.startsWith("ev/")) {
      const evId = val.replace("ev/", "");
      setValue("resourceId", "");
      setValue("assetId", "");
      setValue("externalVideoId", evId);
      const video = ArrayHelper.getOne(getCombinedVideos(), "id", evId);
      setValue("content", video?.name || "");
    } else {
      setValue("resourceId", val);
      setValue("assetId", "");
      setValue("externalVideoId", "");
      const resource = ArrayHelper.getOne(getCombinedResources(), "id", val);
      setValue("content", resource?.name || "");
    }
  };

  const onAssetChange = (val: string) => {
    setValue("assetId", val);
    const assetResource = ArrayHelper.getOne(getCombinedResources(), "id", getValues("resourceId"));
    const asset = ArrayHelper.getOne(props.allAssets, "id", val);
    setValue("content", asset ? (assetResource?.name || "") + " - " + asset.name : assetResource?.name || "");
  };

  const onAddOnChange = (val: string) => {
    setValue("addOnId", val);
    const addOn = ArrayHelper.getOne(props.addOns, "id", val);
    setValue("content", addOn?.name || "");
  };

  const getResourceGroup = (groupName: string, resources: ResourceInterface[], videos: ExternalVideoInterface[]) => {
    if (resources.length > 0 || videos.length > 0) {
      const items: React.JSX.Element[] = [];
      items.push(<ListSubheader key={groupName}>{groupName}</ListSubheader>);
      resources.forEach(r => items.push(<MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>));
      videos.forEach(v => items.push(<MenuItem key={"ev/" + v.id} value={"ev/" + v.id}>{v.name}</MenuItem>));
      return items;
    }
  };

  const getAsset = () => {
    if (props.allAssets && resourceId) {
      const assets = ArrayHelper.getAll(props.allAssets, "resourceId", resourceId);
      if (assets.length > 0) {
        return (
          <FormControl fullWidth>
            <InputLabel>Asset</InputLabel>
            <Select label="Asset" name="asset" value={assetId || ""} onChange={(ev) => onAssetChange(ev.target.value as string)}>
              <MenuItem value="">All</MenuItem>
              {assets.map((a: AssetInterface) => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
            </Select>
          </FormControl>
        );
      }
    }
  };

  const getResource = () => {
    if (actionType === "Play" || actionType === "Download") {
      if (props.lessonResources && props.studyResources && props.programResources) {
        let currentValue = resourceId || "";
        if (!currentValue && externalVideoId) currentValue = "ev/" + externalVideoId;
        return (
          <>
            <FormControl fullWidth>
              <InputLabel>Resource</InputLabel>
              <Select label="Resource" name="resource" id="resourceSelect" value={currentValue} onChange={(ev) => onResourceChange(ev.target.value as string)}>
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

  const getAddOn = () => {
    if (actionType === "Add-on" && props.addOns.length > 0) {
      return (
        <>
          <FormControl fullWidth>
            <InputLabel>Add-on</InputLabel>
            <Select label="Add-on" name="addOn" value={addOnId || ""} onChange={(ev) => onAddOnChange(ev.target.value as string)}>
              {props.addOns.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
            </Select>
          </FormControl>
          {getAsset()}
        </>
      );
    }
  };

  useEffect(() => {
    if (props.action) {
      reset({
        sort: props.action.sort ?? "",
        actionType: props.action.actionType || "",
        content: props.action.content || "",
        resourceId: props.action.resourceId || "",
        externalVideoId: props.action.externalVideoId || "",
        assetId: props.action.assetId || "",
        addOnId: props.action.addOnId || ""
      });
    }
  }, [props.action, reset]);

  useEffect(() => {
    if (actionType === "Play" || actionType === "Download") {
      if (resourceId) {
        const resources = getCombinedResources();
        if (resources.length > 0 && ArrayHelper.getOne(resources, "id", resourceId) === null) {
          setValue("resourceId", resources[0].id);
          setValue("content", resources[0].name);
          setValue("assetId", "");
          setValue("addOnId", "");
        }
      }
    } else if (actionType === "Add-on") {
      if (addOnId && props.addOns.length > 0 && ArrayHelper.getOne(props.addOns, "id", addOnId) === null) {
        setValue("addOnId", props.addOns[0].id);
        setValue("content", props.addOns[0].name);
        setValue("assetId", "");
        setValue("resourceId", "");
      }
    }
  }, [actionType]);

  if (!props.action) return <></>;
  return (
    <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CheckIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem" }}>
            {props.action?.id ? "Edit Action" : "Create Action"}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}

        <Stack spacing={3}>
          <TextField fullWidth label="Order" type="number" placeholder="1" helperText="Display order for this action within the role" {...register("sort")} />

          <Controller
            control={control}
            name="actionType"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Action Type</InputLabel>
                <Select {...field} label="Action Type">
                  <MenuItem value="Say">Say</MenuItem>
                  <MenuItem value="Do">Do</MenuItem>
                  <MenuItem value="Play">Play</MenuItem>
                  <MenuItem value="Download">Download</MenuItem>
                  <MenuItem value="Note">Note</MenuItem>
                  <MenuItem value="Add-on">Add-on</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {actionType !== "Play" && actionType !== "Download" && actionType !== "Add-on" && (
            <Controller
              control={control}
              name="content"
              rules={{ required: "Please enter content text." }}
              render={({ field }) => (
                <MarkdownEditor value={field.value} onChange={(v: string) => field.onChange(v)} />
              )}
            />
          )}
          {getResource()}
          {getAddOn()}
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
        <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit(onValid)}>Save</Button>
        <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>Cancel</Button>
        {props.action?.id && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
