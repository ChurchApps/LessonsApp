import { useState, useEffect } from "react";
import { ApiHelper, SectionInterface } from "@/utils";
import { InputBox, ErrorMessages } from "@churchapps/apphelper";
import { TextField } from "@mui/material";

type Props = {
  section: SectionInterface;
  updatedCallback: (section: SectionInterface, created: boolean) => void;
};

export function SectionEdit(props: Props) {
  const [section, setSection] = useState<SectionInterface>({} as SectionInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(section, false);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") { e.preventDefault(); handleSave(); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let s = { ...section };
    switch (e.currentTarget.name) {
      case "name":
        s.name = e.currentTarget.value;
        break;
      case "materials":
        s.materials = e.currentTarget.value;
        break;
      case "sort":
        s.sort = parseInt(e.currentTarget.value);
        break;
    }
    setSection(s);
  };

  const validate = () => {
    let errors = [];
    if (section.name === "") errors.push("Please enter a section name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/sections", [section], "LessonsApi").then((data) => {
        setSection(data);
        props.updatedCallback(data[0], !props.section.id);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this section?")) {
      ApiHelper.delete("/sections/" + section.id.toString(), "LessonsApi").then(() => props.updatedCallback(null, false)
      );
    }
  };

  useEffect(() => { setSection(props.section); }, [props.section]);

  return (
    <>
      <InputBox id="sectionDetailsBox" headerText={section?.id ? "Edit Section" : "Create Section"} headerIcon="list_alt" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
        <ErrorMessages errors={errors} />
        <TextField label="Order" fullWidth type="number" name="sort" value={section.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
        <TextField label="Section Name" fullWidth name="name" value={section.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Section 1" />
        <TextField label="Materials Needed" fullWidth name="materials" value={section.materials} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="" />
      </InputBox>
    </>
  );
}
