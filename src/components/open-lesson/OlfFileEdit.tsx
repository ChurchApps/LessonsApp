import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ErrorMessages, InputBox } from "@churchapps/apphelper";
import { FeedFileInterface } from "@/helpers";

interface Props {
  file: FeedFileInterface;
  updatedCallback: (file: FeedFileInterface, cancelled: boolean) => void;
}

export function OlfFileEdit(props: Props) {
  const [file, setFile] = useState<FeedFileInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let f = { ...file };
    switch (e.target.name) {
      case "name":
        f.name = e.target.value;
        break;
      case "url":
        f.url = e.target.value;
        break;
      case "thumbnail":
        f.thumbnail = e.target.value;
        break;
      case "streamUrl":
        f.streamUrl = e.target.value;
        break;
      case "seconds":
        f.seconds = parseInt(e.target.value);
        break;
      case "loop":
        f.loop = e.target.value === "true";
        if (!f.loop) f.seconds = 0;
        else f.seconds = null;
        break;
    }
    setFile(f);
  };

  const validate = () => {
    let errors = [];
    if (file.name === "") errors.push("Please enter file name");
    if (file.url === "") errors.push("Please enter url");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) props.updatedCallback(file, false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this action?")) props.updatedCallback(null, false);
  };

  useEffect(() => {
    setFile(props.file);
  }, [props.file]);

  if (!file) {
    return <></>;
  } else {
    return (
      <>
        <InputBox
          id="fileDetailsBox"
          headerText={props.file ? "Edit File" : "Add File"}
          headerIcon="check"
          saveFunction={handleSave}
          cancelFunction={handleCancel}
          deleteFunction={handleDelete}>
          <ErrorMessages errors={errors} />
          <TextField fullWidth autoFocus name="name" label="Name" value={file.name} onChange={handleChange} />
          <TextField fullWidth name="url" label="URL" value={file.url} onChange={handleChange} />
          <b>Video Details</b>
          <TextField
            fullWidth
            name="thumbnail"
            label="Thumbnail (optional)"
            value={file.thumbnail}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="streamUrl"
            label="Stream URL (optional)"
            value={file.streamUrl}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel>Loop Video</InputLabel>
            <Select label="Loop Video" name="loop" value={file.loop ? "true" : "false"} onChange={handleChange}>
              <MenuItem value="false" key="false">
                No
              </MenuItem>
              <MenuItem value="true" key="true">
                Yes
              </MenuItem>
            </Select>
          </FormControl>
          {!file.loop && (
            <TextField fullWidth name="seconds" label="Seconds" value={file.seconds} onChange={handleChange} />
          )}
        </InputBox>
      </>
    );
  }
}
