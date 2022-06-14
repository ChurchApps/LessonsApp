import { useState, useEffect } from "react";
import { InputBox, ErrorMessages } from "../index";
import { ArrayHelper, AssetInterface, ResourceInterface, ActionInterface, ApiHelper } from "@/utils";
import { InputLabel, MenuItem, Select, FormControl, TextField, SelectChangeEvent } from "@mui/material";

type Props = {
  action: ActionInterface;
  lessonResources: ResourceInterface[];
  studyResources: ResourceInterface[];
  programResources: ResourceInterface[];
  allAssets: AssetInterface[];
  updatedCallback: (action: ActionInterface, created: boolean) => void;
};

export function ActionEdit(props: Props) {
  const [action, setAction] = useState<ActionInterface>({} as ActionInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(action, false);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
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
        a.resourceId = e.target.value;
        a.assetId = null;
        let select = e.currentTarget as HTMLSelectElement;
        a.content = select.options[select.selectedIndex].text;
        break;
      case "asset":
        a.assetId = e.target.value;
        if (a.assetId === "") a.assetId = null;
        let resourceSelect = document.getElementById("resourceSelect") as HTMLSelectElement;
        let assetSelect = e.target as HTMLSelectElement;
        a.content = resourceSelect.options[resourceSelect.selectedIndex].text + " - " + assetSelect.options[assetSelect.selectedIndex].text;
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
        if (a.resourceId === null) {
          if (props.lessonResources.length > 0) a.resourceId = props.lessonResources[0].id;
          else if (props.studyResources.length > 0) a.resourceId = props.studyResources[0].id;
          else if (props.programResources.length > 0) a.resourceId = props.programResources[0].id;

        }
      }

      ApiHelper.post("/actions", [a], "LessonsApi").then((data) => {
        setAction(data);
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
      const markdownLink = <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" style={{ float: "right" }}>Markdown Guide</a>
      return <TextField fullWidth multiline label={<>Content &nbsp; {markdownLink}</>} name="content" rows={8} value={action.content} onChange={handleChange} placeholder="" />
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
          <Select label="Asset" name="asset" value={action.assetId} onChange={handleChange} >
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
        return (
          <>
            <FormControl fullWidth>
              <InputLabel>Resource</InputLabel>
              <Select label="Resource" name="resource" id="resourceSelect" value={action.resourceId} onChange={handleChange} >
                {getResourceGroup("Lesson", props.lessonResources)}
                {getResourceGroup("Study", props.studyResources)}
                {getResourceGroup("Program", props.programResources)}
              </Select>
            </FormControl>


            {getAsset()}
          </>
        );
      }
    }
  };

  const getResourceGroup = (groupName: string, resources: ResourceInterface[]) => {
    if (resources.length > 0) {
      const items: JSX.Element[] = [];
      items.push(<MenuItem disabled value="">{groupName}</MenuItem>);
      resources.forEach((r) => { items.push(<MenuItem value={r.id}>{r.name}</MenuItem>); });
      return items;
    }
  };

  const updateResource = () => {
    if (action.actionType === "Play" || action.actionType === "Download") {
      const el: any = document.getElementById("resourceSelect");
      if (el.options.length > 0 && el.selectedIndex === 0) {
        const optVal = el.options[0].value;
        if (optVal !== action.resourceId) {
          let a = { ...action };
          a.resourceId = optVal;
          a.assetId = null;
          a.content = el.options[0].text;
          setAction(a);
        }
      }
    }
  }

  useEffect(() => {
    setAction(props.action);
    setTimeout(updateResource, 500);
  }, [props.action]);

  return (
    <>
      <InputBox id="actionDetailsBox" headerText={action?.id ? "Edit Action" : "Create Action"} headerIcon="fas fa-check" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete} >
        <ErrorMessages errors={errors} />
        <TextField fullWidth label="Order" type="number" name="sort" value={action.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />

        <FormControl fullWidth>
          <InputLabel>Action Type</InputLabel>
          <Select label="Action Type" name="actionType" value={action.actionType} onChange={handleChange} >
            <MenuItem value="Say">Say</MenuItem>
            <MenuItem value="Do">Do</MenuItem>
            <MenuItem value="Play">Play</MenuItem>
            <MenuItem value="Download">Download</MenuItem>
            <MenuItem value="Note">Note</MenuItem>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Stripe">Stripe</MenuItem>
          </Select>
        </FormControl>
        {getContent()}
        {getResource()}
      </InputBox>
    </>
  );
}
