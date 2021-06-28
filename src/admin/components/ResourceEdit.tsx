import React from "react";
import { ApiHelper, InputBox, ErrorMessages, ResourceInterface } from ".";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  resource: ResourceInterface,
  updatedCallback: (resource: ResourceInterface) => void
}

export const ResourceEdit: React.FC<Props> = (props) => {
  const [resource, setResource] = React.useState<ResourceInterface>({} as ResourceInterface);
  const [errors, setErrors] = React.useState([]);

  const handleCancel = () => props.updatedCallback(resource);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let v = { ...resource };
    switch (e.currentTarget.name) {
      case "name": v.name = e.currentTarget.value; break;
    }
    setResource(v);
  }

  const validate = () => {
    let errors = [];
    if (resource.name === "") errors.push("Please enter a resource name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/resources", [resource], "LessonsApi").then(data => {
        setResource(data);
        props.updatedCallback(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this resource?")) {
      ApiHelper.delete("/resources/" + resource.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  }

  React.useEffect(() => { setResource(props.resource) }, [props.resource]);


  return (<>
    <InputBox id="resourceDetailsBox" headerText="Edit Resource" headerIcon="fas fa-file-alt" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <FormGroup>
        <FormLabel>Resource Name</FormLabel>
        <FormControl type="text" name="name" value={resource.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Resource 1" />
      </FormGroup>
    </InputBox>
  </>);
}
