import { useState, useEffect } from "react";
import { InputBox, ErrorMessages, MarkdownEditor } from "@churchapps/apphelper";
import { FeedProgramInterface } from "@/helpers";
import { SelectChangeEvent, TextField } from "@mui/material";

interface Props {
  program: FeedProgramInterface;
  updatedCallback: (program: FeedProgramInterface, cancelled:boolean) => void;
}

export function OllProgramEdit(props: Props) {
  const [program, setProgram] = useState<FeedProgramInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);


  const handleMarkdownChange = (newValue: string) => {
    let p = { ...program };
    p.description = newValue;
    setProgram(p);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let p = { ...program };
    switch (e.target.name) {
      case "id": p.id = e.target.value; break;
      case "name": p.name = e.target.value; break;
      case "image": p.image = e.target.value; break;
      case "description": p.description = e.target.value; break;
    }
    setProgram(p);
  };

  const validate = () => {
    let errors = [];
    if (program.name === "") errors.push("Please enter a name.");
    if (program.id === "") errors.push("Please enter an id.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      props.updatedCallback(program, false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this program?")) {
      props.updatedCallback(null, false);
    }
  };

  useEffect(() => {
    setProgram(props.program);
  }, [props.program]);


  if (!program) return <></>;
  else return (
    <>
      <InputBox id="programDetailsBox" headerText={props.program ? "Edit Program" : "Create Program"} headerIcon="check" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
        <ErrorMessages errors={errors} />
        <TextField fullWidth label="Id" name="id" value={program.id} onChange={handleChange} />
        <TextField fullWidth label="Name" name="name" value={program.name} onChange={handleChange} />
        <TextField fullWidth label="Image" name="image" value={program.image} onChange={handleChange} />
        <label>Description</label>
        <MarkdownEditor value={program.description} onChange={handleMarkdownChange} />
      </InputBox>
    </>
  );
}
