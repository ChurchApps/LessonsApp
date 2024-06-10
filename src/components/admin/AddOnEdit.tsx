import { useState, useEffect } from "react";
import { ErrorMessages, InputBox } from "@churchapps/apphelper";
import { ImageEditor } from "../index";
import { AddOnInterface, ApiHelper } from "@/utils";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

type Props = {
  addOn: AddOnInterface;
  updatedCallback: (addOn: AddOnInterface) => void;
};

export function AddOnEdit(props: Props) {
  const [addOn, setAddOn] = useState<AddOnInterface>(null);
  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);

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
    }
    setAddOn(a);
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
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/addOns", [addOn], "LessonsApi").then((data) => {
        setAddOn(data);
        props.updatedCallback(data);
      });
    }
  };

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
      </InputBox>
    </>
  );
}
