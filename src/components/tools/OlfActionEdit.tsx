import { useState, useEffect } from "react";
import { InputBox, ErrorMessages, MarkdownEditor } from "@churchapps/apphelper";
import { FeedActionInterface } from "@/utils";
import { InputLabel, MenuItem, Select, FormControl, SelectChangeEvent } from "@mui/material";

type Props = {
  action: FeedActionInterface;
  updatedCallback: (action: FeedActionInterface, cancelled:boolean) => void;
};

export function OlfActionEdit(props: Props) {
  const [action, setAction] = useState<FeedActionInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);


  const handleMarkdownChange = (newValue: string) => {
    let a = { ...action };
    a.content = newValue;
    setAction(a);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let a = { ...action };
    switch (e.target.name) {
      case "actionType":
        a.actionType = e.target.value;
        break;
      case "content":
        a.content = e.target.value;
        break;
    }
    setAction(a);
  };

  const validate = () => {
    let errors = [];
    if (action.content === "") errors.push("Please enter content text.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const a = action;
      if (!a.actionType) a.actionType = "say";
      props.updatedCallback(a, false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this action?")) {
      props.updatedCallback(null, false);
    }
  };

  const getContent = () => {
    if (action.actionType !== "Play" && action.actionType !== "Download") {
      return <MarkdownEditor value={action.content} onChange={handleMarkdownChange} />
    }
  };


  useEffect(() => {
    setAction(null);
    setTimeout(() => { setAction(props.action); }, 100);
  }, [props.action]);


  if (!action) return <></>;
  else return (
    <>
      <InputBox id="actionDetailsBox" headerText={props.action ? "Edit Action" : "Create Action"} headerIcon="check" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
        <ErrorMessages errors={errors} />

        <FormControl fullWidth>
          <InputLabel>Action Type</InputLabel>
          <Select label="Action Type" name="actionType" value={action.actionType} onChange={handleChange}>
            <MenuItem value="say" key="say">Say</MenuItem>
            <MenuItem value="do" key="do">Do</MenuItem>
            <MenuItem value="play" key="play">Play</MenuItem>
            <MenuItem value="note" key="note">Note</MenuItem>
          </Select>
        </FormControl>
        {getContent()}
      </InputBox>
    </>
  );
}
