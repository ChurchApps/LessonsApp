import React from "react";
import { ApiHelper, InputBox, ErrorMessages, ActionInterface } from ".";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { ResourceInterface } from "../../helpers";

interface Props {
  action: ActionInterface,
  studyId: string,
  programId: string,
  updatedCallback: (action: ActionInterface, created: boolean) => void
}

export const ActionEdit: React.FC<Props> = (props) => {
  const [action, setAction] = React.useState<ActionInterface>({} as ActionInterface);
  const [errors, setErrors] = React.useState([]);

  const [lessonResources, setLessonResources] = React.useState<ResourceInterface[]>(null);
  const [studyResources, setStudyResources] = React.useState<ResourceInterface[]>(null);
  const [programResources, setProgramResources] = React.useState<ResourceInterface[]>(null);


  const handleCancel = () => props.updatedCallback(action, false);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let a = { ...action };
    switch (e.currentTarget.name) {
      case "sort": a.sort = parseInt(e.currentTarget.value); break;
      case "actionType":
        a.actionType = e.currentTarget.value;
        break;
      case "content": a.content = e.currentTarget.value; break;
      case "resource":
        a.resourceId = e.currentTarget.value;
        let select = e.currentTarget as HTMLSelectElement;
        a.content = select.options[select.selectedIndex].text;
        break;
    }
    setAction(a);
  }

  const checkResourcesLoaded = () => {
    if (action?.actionType === "Play") {
      if (!lessonResources) ApiHelper.get("/resources/content/lesson/" + action.lessonId, "LessonsApi").then((data: any) => { setLessonResources(data); });
      if (!studyResources) ApiHelper.get("/resources/content/study/" + props.studyId, "LessonsApi").then((data: any) => { setStudyResources(data); });
      if (!programResources) ApiHelper.get("/resources/content/program/" + props.programId, "LessonsApi").then((data: any) => { setProgramResources(data); });
    }
  }

  const validate = () => {
    let errors = [];
    if (action.sort === -1) errors.push("Please enter a action name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      const a = action;
      if (!a.actionType) a.actionType = "Say";
      if (a.actionType !== "Play") { a.resourceId = null; a.assetId = null; }

      ApiHelper.post("/actions", [a], "LessonsApi").then(data => {
        setAction(data);
        props.updatedCallback(data[0], !props.action.id);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this action?")) {
      ApiHelper.delete("/actions/" + action.id.toString(), "LessonsApi").then(() => props.updatedCallback(null, false));
    }
  }

  const getContent = () => {
    if (action.actionType !== "Play") {
      return (<FormGroup>
        <FormLabel>Content</FormLabel>
        <FormControl type="text" name="content" value={action.content} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="" />
      </FormGroup>);
    }
  }

  const getResource = () => {
    if (action.actionType === "Play") {
      if (lessonResources && studyResources && programResources) {
        if (!action.resourceId) action.resourceId = lessonResources.concat(studyResources).concat(programResources)[0].id;
        return (<FormGroup>
          <FormLabel>Resource</FormLabel>
          <FormControl as="select" name="resource" value={action.resourceId} onChange={handleChange}>
            {getResourceGroup("Lesson", lessonResources)}
            {getResourceGroup("Study", studyResources)}
            {getResourceGroup("Program", programResources)}
          </FormControl>
        </FormGroup>);
      }
    }
  }


  const getResourceGroup = (groupName: string, resources: ResourceInterface[]) => {
    if (resources.length > 0) {
      const items: JSX.Element[] = [];
      resources.forEach(r => { items.push(<option value={r.id}>{r.name}</option>) })
      return <optgroup label={groupName}>{items}</optgroup>
    }
  }


  React.useEffect(() => { setAction(props.action) }, [props.action]);
  React.useEffect(() => { checkResourcesLoaded() }, [action]);


  return (<>
    <InputBox id="actionDetailsBox" headerText={(action?.id) ? "Edit Action" : "Create Action"} headerIcon="fas fa-check" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <FormGroup>
        <FormLabel>Order</FormLabel>
        <FormControl type="number" name="sort" value={action.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Action Type</FormLabel>
        <FormControl as="select" name="actionType" value={action.actionType} onChange={handleChange}>
          <option value="Say">Say</option>
          <option value="Do">Do</option>
          <option value="Play">Play</option>
        </FormControl>
      </FormGroup>
      {getContent()}
      {getResource()}
    </InputBox>
  </>);
}
