import { useState, useEffect } from "react";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, ExternalVideoInterface } from "@/utils";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

type Props = {
  externalVideo: ExternalVideoInterface;
  updatedCallback: (externalVideo: ExternalVideoInterface) => void;
  contentDisplayName: string;
};

export function ExternalVideoEdit(props: Props) {
  const [externalVideo, setExternalVideo] = useState<ExternalVideoInterface>(null);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(externalVideo);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let v = { ...externalVideo };
    switch (e.target.name) {
      case "name":
        v.name = e.target.value;
        break;
      case "provider":
        v.videoProvider = e.target.value;
        break;
      case "videoId":
        v.videoId = e.target.value;
        break;
      case "loopVideo":
        v.loopVideo = e.target.value === "true";
        break;
    }
    setExternalVideo(v);
  };

  const validate = () => {
    let errors = [];
    if (externalVideo.name === "") errors.push("Please enter a video name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/externalVideos", [externalVideo], "LessonsApi").then((data) => {
        setExternalVideo(data);
        props.updatedCallback(data);
      });
    }
  };

  const getDeleteFunction = () => props.externalVideo?.id ? handleDelete : undefined;

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this video?")) {
      ApiHelper.delete("/externalVideos/" + externalVideo.id.toString(), "LessonsApi")
        .then(() => props.updatedCallback(null));
    }
  };

  useEffect(() => { setExternalVideo(props.externalVideo); }, [props.externalVideo]);

  if (!externalVideo) return <></>
  else return (
    <>
      <InputBox id="externalVideoDetailsBox" headerText={props.contentDisplayName} headerIcon="insert_drive_file" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()}>
        <ErrorMessages errors={errors} />
        <TextField fullWidth label="Video Name" name="name" value={externalVideo.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Lesson 1" />
        <FormControl fullWidth>
          <InputLabel>Provider</InputLabel>
          <Select fullWidth label="Provider" name="provider" aria-label="provider" value={externalVideo.videoProvider} onChange={handleChange}>
            <MenuItem value="Vimeo">Vimeo</MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth label="Video Id" name="videoId" value={externalVideo.videoId} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="abc123" />
        <FormControl fullWidth>
          <InputLabel>Looping Video</InputLabel>
          <Select label="Looping Video" name="loopVideo" value={externalVideo.loopVideo?.toString()} onChange={handleChange}>
            <MenuItem value="false">No</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
          </Select>
        </FormControl>
      </InputBox>
    </>
  );
}
