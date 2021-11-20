import { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, ResourceInterface } from "@/utils";

type Props = {
  resource: ResourceInterface;
  updatedCallback: (resource: ResourceInterface) => void;
  contentDisplayName: string;
};

export function ResourceEdit(props: Props) {
  const [resource, setResource] = useState<ResourceInterface>({} as ResourceInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(resource);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let v = { ...resource };
    switch (e.currentTarget.name) {
      case "name":
        v.name = e.currentTarget.value;
        break;
      case "category":
        v.category = e.currentTarget.value;
        break;
    }
    setResource(v);
  };

  const validate = () => {
    let errors = [];
    if (resource.name === "") errors.push("Please enter a resource name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/resources", [resource], "LessonsApi").then((data) => {
        setResource(data);
        props.updatedCallback(data);
      });
    }
  };

  const getDeleteFunction = () => props.resource?.id ? handleDelete : undefined;

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this resource?  This will delete all variants and assets.")) {
      ApiHelper.delete("/resources/" + resource.id.toString(), "LessonsApi")
        .then(() => props.updatedCallback(null));
    }
  };

  useEffect(() => { setResource(props.resource); }, [props.resource]);

  return (
    <>
      <InputBox id="resourceDetailsBox" headerText={props.contentDisplayName} headerIcon="fas fa-file-alt" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()} >
        <ErrorMessages errors={errors} />
        <FormGroup>
          <FormLabel>Resource Name</FormLabel>
          <FormControl type="text" name="name" value={resource.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Countdown Video" />
        </FormGroup>
      </InputBox>
    </>
  );
}
