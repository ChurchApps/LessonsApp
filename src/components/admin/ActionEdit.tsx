import { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { InputBox, ErrorMessages } from "../index";
import { ArrayHelper, AssetInterface, ResourceInterface, ActionInterface, ApiHelper } from "@/utils";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let a = { ...action };
    switch (e.currentTarget.name) {
      case "sort":
        a.sort = parseInt(e.currentTarget.value);
        break;
      case "actionType":
        a.actionType = e.currentTarget.value;
        break;
      case "content":
        a.content = e.currentTarget.value;
        break;
      case "resource":
        a.resourceId = e.currentTarget.value;
        a.assetId = null;
        let select = e.currentTarget as HTMLSelectElement;
        a.content = select.options[select.selectedIndex].text;
        break;
      case "asset":
        a.assetId = e.currentTarget.value;
        if (a.assetId === "") a.assetId = null;
        let resourceSelect = document.getElementById("resourceSelect") as HTMLSelectElement;
        let assetSelect = e.currentTarget as HTMLSelectElement;
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
      return (
        <FormGroup>
          <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" style={{ float: "right" }}>
            Markdown Guide
          </a>
          <FormLabel>Content</FormLabel>
          <FormControl type="text" name="content" as="textarea" rows={8} value={action.content} onChange={handleChange} placeholder="" />
        </FormGroup>
      );
    }
  };

  const getAsset = () => {
    if (props.allAssets && action?.resourceId) {
      const assets = ArrayHelper.getAll(props.allAssets, "resourceId", action.resourceId);
      if (assets.length > 0) {
        const assetItems: JSX.Element[] = [];
        assets.forEach((a: AssetInterface) =>
          assetItems.push(<option value={a.id}>{a.name}</option>)
        );

        return (
          <>
            <FormGroup>
              <FormLabel>Asset</FormLabel>
              <FormControl as="select" name="asset" value={action.assetId} onChange={handleChange} >
                <option value="">All</option>
                {assetItems}
              </FormControl>
            </FormGroup>
          </>
        );
      }
    }
  };

  const getResource = () => {
    if (action.actionType === "Play" || action.actionType === "Download") {
      if (props.lessonResources && props.studyResources && props.programResources) {
        return (
          <>
            <FormGroup>
              <FormLabel>Resource</FormLabel>
              <FormControl as="select" name="resource" id="resourceSelect" value={action.resourceId} onChange={handleChange} >
                {getResourceGroup("Lesson", props.lessonResources)}
                {getResourceGroup("Study", props.studyResources)}
                {getResourceGroup("Program", props.programResources)}
              </FormControl>
            </FormGroup>
            {getAsset()}
          </>
        );
      }
    }
  };

  const getResourceGroup = (groupName: string, resources: ResourceInterface[]) => {
    if (resources.length > 0) {
      const items: JSX.Element[] = [];
      resources.forEach((r) => {
        items.push(<option value={r.id}>{r.name}</option>);
      });
      return <optgroup label={groupName}>{items}</optgroup>;
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
        <FormGroup>
          <FormLabel>Order</FormLabel>
          <FormControl type="number" name="sort" value={action.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
        </FormGroup>
        <FormGroup>
          <FormLabel>Action Type</FormLabel>
          <FormControl as="select" name="actionType" value={action.actionType} onChange={handleChange} >
            <option value="Say">Say</option>
            <option value="Do">Do</option>
            <option value="Play">Play</option>
            <option value="Download">Download</option>
            <option value="Note">Note</option>
          </FormControl>
        </FormGroup>
        {getContent()}
        {getResource()}
      </InputBox>
    </>
  );
}
