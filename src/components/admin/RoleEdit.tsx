import { useState, useEffect } from "react";
import { ApiHelper, RoleInterface } from "@/helpers";
import { InputBox, ErrorMessages } from "@churchapps/apphelper";
import { TextField } from "@mui/material";

interface Props {
  role: RoleInterface;
  updatedCallback: (role: RoleInterface, created: boolean) => void;
}

export function RoleEdit(props: Props) {
  const [role, setRole] = useState<RoleInterface>({} as RoleInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(role, false);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let r = { ...role };
    switch (e.currentTarget.name) {
      case "name": r.name = e.currentTarget.value; break;
      case "sort": r.sort = parseInt(e.currentTarget.value); break;
    }
    setRole(r);
  };

  const validate = () => {
    let errors = [];
    if (role.name === "") errors.push("Please enter a role name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/roles", [role], "LessonsApi").then((data) => {
        setRole(data);
        props.updatedCallback(data[0], !props.role.id);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this role?")) {
      ApiHelper.delete("/roles/" + role.id.toString(), "LessonsApi").then(() => props.updatedCallback(null, false));
    }
  };

  useEffect(() => { setRole(props.role); }, [props.role]);

  return (
    <InputBox id="roleDetailsBox" headerText={role?.id ? "Edit Role" : "Create Role"} headerIcon="person" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <TextField fullWidth label="Order" type="number" name="sort" value={role.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
      <TextField fullWidth label="Role Name" name="name" value={role.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Leader" />
    </InputBox>
  );
}
