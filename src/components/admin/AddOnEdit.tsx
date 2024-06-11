import { useState, useEffect } from "react";
import { ErrorMessages, InputBox, Loading } from "@churchapps/apphelper";
import { ImageEditor } from "../index";
import { AddOnInterface, ApiHelper, ExternalVideoInterface, FileInterface } from "@/utils";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { FileUpload } from "./FileUpload";

type Props = {
  addOn: AddOnInterface;
  updatedCallback: (addOn: AddOnInterface) => void;
};

export function AddOnEdit(props: Props) {
  const [addOn, setAddOn] = useState<AddOnInterface>(null);
  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [externalVideo, setExternalVideo] = useState<ExternalVideoInterface>(null);
  const [file, setFile] = useState<FileInterface>(null);
  const [pendingFileSave, setPendingFileSave] = useState(false);

  const handleCancel = () => props.updatedCallback(addOn);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let a = { ...addOn };
    const val = e.target.value;
    switch (e.target.name) {
      case "category": a.category = val; break;
      case "name": a.name = val; break;
      case "image": a.image = val; break;
      case "addOnType": a.addOnType = val; break;
    }
    setAddOn(a);
    loadContent(a);
  };

  const handleImageUpdated = (dataUrl: string) => {
    const a = { ...addOn };
    a.image = dataUrl;
    setAddOn(a);
    setShowImageEditor(false);
  };

  const validate = () => {
    let errors = [];
    if (addOn.name === "") errors.push("Please enter a name.");
    if (addOn.addOnType === "externalVideo") {
      if (!externalVideo.videoId) errors.push("Please enter a video id.");
    }
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/addOns", [addOn], "LessonsApi").then((data) => {
        setAddOn(data);
        if (addOn.addOnType === "file") {
          setTimeout(() => {
            setPendingFileSave(true);
          }, 100);
        }
        else {
          ApiHelper.post("/externalVideos", [externalVideo], "LessonsApi").then(() => {
            props.updatedCallback(data);
          });
        }
      });
    }
  };

  const getFileFields = () => <FileUpload key="fileUpload" contentType="addOn" contentId={props.addOn.id} fileId={addOn?.fileId} pendingSave={pendingFileSave} saveCallback={handleFileSaved} resourceId={""} />

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this add-on?")) {
      ApiHelper.delete("/addOns/" + addOn.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  };

  const handleImageClick = (e: React.MouseEvent) => { e.preventDefault(); setShowImageEditor(true); };

  useEffect(() => { setAddOn(props.addOn); }, [props.addOn]);

  const getImageEditor = () => {
    if (showImageEditor) return (<ImageEditor updatedFunction={handleImageUpdated} imageUrl={addOn.image} onCancel={() => setShowImageEditor(false)} />);
  };

  const getExternalVideoFields = () => {
    if (!externalVideo) return <Loading />;
    else return (<>
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
    </>);
  }

  const getTypeFields = () => {
    switch (addOn.addOnType) {
      case "file": return getFileFields();
      default: return getExternalVideoFields();
    }
  }

  const loadContent = async (a: AddOnInterface) => {
    if (a.addOnType === "file") {
      if (a.fileId) await ApiHelper.get("/file/" + a.fileId, "LessonsApi").then((data) => setFile(data));
      else setFile({ id: "" });
    } else {
      const data = await ApiHelper.get("/externalVideos/content/addOn/" + a.id, "LessonsApi");
      if (data.length > 0) setExternalVideo(data[0]);
      else setExternalVideo({ id: "", videoProvider: "Vimeo", videoId: "", loopVideo: false });
    }
  }

  const handleFileSaved = (file: FileInterface) => {
    const a = { ...addOn };
    a.fileId = file.id;
    ApiHelper.post("/addOns", [a], "LessonsApi").then((data) => {
      setAddOn(data);
      setPendingFileSave(false);
      props.updatedCallback(data);
    });
  };

  if (!addOn) return <></>
  else return (
    <>
      {getImageEditor()}
      <InputBox id="addOnDetailsBox" headerText="Edit Add-on" headerIcon="movie" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
        <ErrorMessages errors={errors} />
        <a href="about:blank" className="d-block" onClick={handleImageClick}>
          <img src={addOn.image || "/images/blank.png"} className="profilePic d-block mx-auto img-fluid" id="imgPreview" alt="add-on" />
        </a>
        <br />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select label="Category" name="category" value={addOn.category || "slow worship"} onChange={handleChange}>
            <MenuItem value="slow worship">Slow Worship</MenuItem>
            <MenuItem value="slow worship with actions">Slow Worship with Actions</MenuItem>
            <MenuItem value="fast worship">Fast Worship</MenuItem>
            <MenuItem value="fast worship with actions">Fast Worship with Actions</MenuItem>
            <MenuItem value="scripture song">Scripture Song</MenuItem>
            <MenuItem value="scripture song with actions">Scripture Song with Actions</MenuItem>
            <MenuItem value="game">Game</MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth label="Name" name="name" value={addOn.name} onChange={handleChange} onKeyDown={handleKeyDown} />
        <FormControl fullWidth>
          <InputLabel>Add-on Type</InputLabel>
          <Select label="Add-on Type" name="addOnType" value={addOn.addOnType} onChange={handleChange}>
            <MenuItem value="externalVideo">External Video</MenuItem>
            <MenuItem value="file">File</MenuItem>
          </Select>
        </FormControl>
        <hr />
        {getTypeFields()}
      </InputBox>
    </>
  );
}
