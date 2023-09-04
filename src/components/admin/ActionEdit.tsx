import { useState, useEffect } from "react";
import { InputBox, ErrorMessages, MarkdownEditor } from "@churchapps/apphelper";
import { ArrayHelper, AssetInterface, ResourceInterface, ActionInterface, ApiHelper, ExternalVideoInterface } from "@/utils";
import { InputLabel, MenuItem, Select, FormControl, TextField, SelectChangeEvent, ListSubheader } from "@mui/material";

type Props = {
  action: ActionInterface;
  lessonVideos: ExternalVideoInterface[];
  studyVideos: ExternalVideoInterface[];
  programVideos: ExternalVideoInterface[];
  lessonResources: ResourceInterface[];
  studyResources: ResourceInterface[];
  programResources: ResourceInterface[];
  allAssets: AssetInterface[];
  updatedCallback: (action: ActionInterface, created: boolean) => void;
};

export function ActionEdit(props: Props) {
  const [action, setAction] = useState<ActionInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(action, false);

  const getCombinedResources = () => {
    let result: ResourceInterface[] = [...props.lessonResources, ...props.studyResources, ...props.programResources];
    return result;
  }

  const getCombinedVideos = () => {
    let result: ExternalVideoInterface[] = [...props.lessonVideos, ...props.studyVideos, ...props.programVideos];
    return result;
  }

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
  }

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
        a.content = (asset) ? assetResource.name + " - " + asset.name : assetResource?.name;
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

      ApiHelper.post("/actions", [a], "LessonsApi").then((data) => {
        setAction(data[0]);
        props.updatedCallback(data[0], !props.action.id);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this action?")) {
      ApiHelper.delete("/actions/" + action.id.toString(), "LessonsApi").then(
        () => props.updatedCallback(null, false)
      );
    }
  };

  const getContent = () => {
    if (action.actionType !== "Play" && action.actionType !== "Download") {
      return <MarkdownEditor value={action.content} onChange={handleMarkdownChange} />
    }
  };

  const getAsset = () => {
    if (props.allAssets && action?.resourceId) {
      const assets = ArrayHelper.getAll(props.allAssets, "resourceId", action.resourceId);
      if (assets.length > 0) {
        const assetItems: JSX.Element[] = [];
        assets.forEach((a: AssetInterface) => assetItems.push(<MenuItem value={a.id}>{a.name}</MenuItem>));

        return (<FormControl fullWidth>
          <InputLabel>Asset</InputLabel>
          <Select label="Asset" name="asset" value={action.assetId || ""} onChange={handleChange}>
            <MenuItem value="">All</MenuItem>
            {assetItems}
          </Select>
        </FormControl>);
      }
    }
  };

  const getResource = () => {
    if (action.actionType === "Play" || action.actionType === "Download") {
      if (props.lessonResources && props.studyResources && props.programResources) {
        let currentValue = action.resourceId;
        if (!currentValue && action.externalVideoId) currentValue = "ev/" + action.externalVideoId
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
      resources.forEach((r) => { items.push(<MenuItem value={r.id}>{r.name}</MenuItem>); });
      videos.forEach((v) => { items.push(<MenuItem value={"ev/" + v.id}>{v.name}</MenuItem>); });
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
            setAction(a);
          }
        }
      }
    }
  }


  useEffect(() => {
    setAction(props.action);
    setTimeout(updateResource, 500);
  }, [props.action]);


  if (!action) return <></>;
  else return (
    <>
      <InputBox id="actionDetailsBox" headerText={action?.id ? "Edit Action" : "Create Action"} headerIcon="check" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
        <ErrorMessages errors={errors} />
        <TextField fullWidth label="Order" type="number" name="sort" value={action.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />

        <FormControl fullWidth>
          <InputLabel>Action Type</InputLabel>
          <Select label="Action Type" name="actionType" value={action.actionType} onChange={handleChange}>
            <MenuItem value="Say" key="Say">Say</MenuItem>
            <MenuItem value="Do" key="Do">Do</MenuItem>
            <MenuItem value="Play" key="Play">Play</MenuItem>
            <MenuItem value="Download" key="Download">Download</MenuItem>
            <MenuItem value="Note" key="Note">Note</MenuItem>
          </Select>
        </FormControl>
        {getContent()}
        {getResource()}
      </InputBox>
    </>
  );
}
