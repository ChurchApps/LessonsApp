import { useState, useEffect } from "react";
import { InputBox, ErrorMessages } from "@churchapps/apphelper";
import { FeedSectionInterface } from "@/helpers";
import { SelectChangeEvent, TextField } from "@mui/material";

type Props = {
  section: FeedSectionInterface;
  updatedCallback: (section: FeedSectionInterface, cancelled:boolean) => void;
};

export function OlfSectionEdit(props: Props) {
  const [section, setSection] = useState<FeedSectionInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let s = { ...section };
    switch (e.target.name) {
      case "name": s.name = e.target.value; break;
    }
    setSection(s);
  };

  const validate = () => {
    let errors = [];
    if (section.name === "") errors.push("Please enter a name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      props.updatedCallback(section, false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this section?")) {
      props.updatedCallback(null, false);
    }
  };

  useEffect(() => {
    setSection(props.section);
  }, [props.section]);


  if (!section) return <></>;
  else return (
    <>
      <InputBox id="sectionDetailsBox" headerText={props.section ? "Edit Section" : "Create Section"} headerIcon="check" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
        <ErrorMessages errors={errors} />
        <TextField fullWidth label="Name" name="name" value={section.name} onChange={handleChange} />
      </InputBox>
    </>
  );
}
