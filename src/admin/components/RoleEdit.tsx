import React from "react";
import { ApiHelper, InputBox, ErrorMessages, RoleInterface } from ".";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  role: RoleInterface,
  updatedCallback: (role: RoleInterface) => void
}

export const RoleEdit: React.FC<Props> = (props) => {
  const [role, setRole] = React.useState<RoleInterface>({} as RoleInterface);
  const [errors, setErrors] = React.useState([]);

  const handleCancel = () => props.updatedCallback(role);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let r = { ...role };
    switch (e.currentTarget.name) {
      case "name": r.name = e.currentTarget.value; break;
      case "sort": r.sort = parseInt(e.currentTarget.value); break;
    }
    setRole(r);
  }

  const validate = () => {
    let errors = [];
    if (role.name === "") errors.push("Please enter a role name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/roles", [role], "LessonsApi").then(data => {
        setRole(data);
        props.updatedCallback(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this role?")) {
      ApiHelper.delete("/roles/" + role.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  }

  React.useEffect(() => { setRole(props.role) }, [props.role]);


  return (<>
    <InputBox id="roleDetailsBox" headerText="Edit Role" headerIcon="fas fa-map-marker" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <FormGroup>
        <FormLabel>Order</FormLabel>
        <FormControl type="number" name="sort" value={role.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Role Name</FormLabel>
        <FormControl type="text" name="name" value={role.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Role 1" />
      </FormGroup>
    </InputBox>
  </>);
}
