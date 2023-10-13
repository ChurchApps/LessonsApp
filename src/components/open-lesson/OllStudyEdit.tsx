import { useState, useEffect } from "react";
import { InputBox, ErrorMessages, MarkdownEditor } from "@churchapps/apphelper";
import { FeedStudyInterface } from "@/utils";
import { SelectChangeEvent, TextField } from "@mui/material";

type Props = {
  study: FeedStudyInterface;
  updatedCallback: (study: FeedStudyInterface, cancelled:boolean) => void;
};

export function OllStudyEdit(props: Props) {
  const [study, setStudy] = useState<FeedStudyInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);


  const handleMarkdownChange = (newValue: string) => {
    let s = { ...study };
    s.description = newValue;
    setStudy(s);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let s = { ...study };
    switch (e.target.name) {
      case "id": s.id = e.target.value; break;
      case "name": s.name = e.target.value; break;
      case "image": s.image = e.target.value; break;
      case "description": s.description = e.target.value; break;
    }
    setStudy(s);
  };

  const validate = () => {
    let errors = [];
    if (study.name === "") errors.push("Please enter a name.");
    if (study.id === "") errors.push("Please enter an id.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      props.updatedCallback(study, false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this study?")) {
      props.updatedCallback(null, false);
    }
  };

  useEffect(() => {
    setStudy(props.study);
  }, [props.study]);


  if (!study) return <></>;
  else return (
    <>
      <InputBox id="studyDetailsBox" headerText={props.study ? "Edit Study" : "Create Study"} headerIcon="check" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
        <ErrorMessages errors={errors} />
        <TextField fullWidth label="Id" name="id" value={study.id} onChange={handleChange} />
        <TextField fullWidth label="Name" name="name" value={study.name} onChange={handleChange} />
        <TextField fullWidth label="Image" name="image" value={study.image} onChange={handleChange} />
        <label>Description</label>
        <MarkdownEditor value={study.description} onChange={handleMarkdownChange} />
      </InputBox>
    </>
  );
}
