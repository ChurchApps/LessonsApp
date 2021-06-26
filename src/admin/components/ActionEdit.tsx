import React from "react";
import { ApiHelper, InputBox, ErrorMessages, ActionInterface } from ".";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  action: ActionInterface,
  updatedCallback: (action: ActionInterface) => void
}

export const ActionEdit: React.FC<Props> = (props) => {
  const [action, setAction] = React.useState<ActionInterface>({} as ActionInterface);
  const [errors, setErrors] = React.useState([]);

  const handleCancel = () => props.updatedCallback(action);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let a = { ...action };
    switch (e.currentTarget.name) {
      case "sort": a.sort = parseInt(e.currentTarget.value); break;
      case "actionType": a.actionType = e.currentTarget.value; break;
      case "content": a.content = e.currentTarget.value; break;
    }
    setAction(a);
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
      ApiHelper.post("/actions", [a], "LessonsApi").then(data => {
        setAction(data);
        props.updatedCallback(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this action?")) {
      ApiHelper.delete("/actions/" + action.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  }

  React.useEffect(() => { setAction(props.action) }, [props.action]);


  return (<>
    <InputBox id="actionDetailsBox" headerText="Edit Action" headerIcon="fas fa-map-marker" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
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
        </FormControl>
      </FormGroup>
      <FormGroup>
        <FormLabel>Content</FormLabel>
        <FormControl type="text" name="content" value={action.content} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="" />
      </FormGroup>
    </InputBox>
  </>);
}
