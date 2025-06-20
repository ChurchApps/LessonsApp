import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ErrorMessages, InputBox } from "@churchapps/apphelper";

const ImageEditor = dynamic(() => import("../index").then(mod => ({ default: mod.ImageEditor })), {
  loading: () => <div>Loading image editor...</div>
});
import { ApiHelper, ProgramInterface } from "@/helpers";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import Link from "next/link";

interface Props {
  program: ProgramInterface;
  updatedCallback: (program: ProgramInterface) => void;
}

export function ProgramEdit(props: Props) {
  const [program, setProgram] = useState<ProgramInterface>(null);
  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);

  const handleCancel = () => props.updatedCallback(program);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let p = { ...program };
    const val = e.target.value;
    switch (e.target.name) {
      case "live": p.live = val === "true"; break;
      case "name": p.name = val; break;
      case "slug": p.slug = val; break;
      case "shortDescription": p.shortDescription = val; break;
      case "description": p.description = val; break;
      case "aboutSection": p.aboutSection = val; break;
      case "videoEmbedUrl": p.videoEmbedUrl = val; break;
    }
    setProgram(p);
  };

  const handleImageUpdated = (dataUrl: string) => {
    const p = { ...program };
    p.image = dataUrl;
    setProgram(p);
    setShowImageEditor(false);
  };

  const validate = () => {
    let errors = [];
    if (program.name === "") errors.push("Please enter a program name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/programs", [program], "LessonsApi").then((data) => {
        setProgram(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this program?")) {
      ApiHelper.delete("/programs/" + program.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  };

  const handleImageClick = (e: React.MouseEvent) => { e.preventDefault(); setShowImageEditor(true); };

  useEffect(() => { setProgram(props.program); }, [props.program]);

  const getImageEditor = () => {
    if (showImageEditor) return (<ImageEditor updatedFunction={handleImageUpdated} imageUrl={program.image} onCancel={() => setShowImageEditor(false)} />);
  };

  if (!program) return <></>
  else return (
    <>
      {getImageEditor()}
      <InputBox id="programDetailsBox" headerText="Edit Program" headerIcon="school" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
        <ErrorMessages errors={errors} />
        <a href="about:blank" className="d-block" onClick={handleImageClick}>
          <img src={program.image || "/images/blank.png"} className="profilePic d-block mx-auto img-fluid" id="imgPreview" alt="program" />
        </a>
        <br />
        <FormControl fullWidth>
          <InputLabel>Live</InputLabel>
          <Select label="Live" name="live" value={program.live?.toString()} onChange={handleChange}>
            <MenuItem value="false">No</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth label="Program Name" name="name" value={program.name} onChange={handleChange} onKeyDown={handleKeyDown} />
        <TextField fullWidth label="Url Slug" name="slug" value={program.slug} onChange={handleChange} onKeyDown={handleKeyDown} />
        <div>
          <a href={"https://lessons.church/" + program.slug + "/"} target="_blank" rel="noopener noreferrer">
            {"https://lessons.church/" + program.slug + "/"}
          </a>
        </div>
        <TextField fullWidth label="One-Line Description" name="shortDescription" value={program.shortDescription} onChange={handleChange} onKeyDown={handleKeyDown} />
        <TextField fullWidth multiline label="Description" name="description" value={program.description} onChange={handleChange} onKeyDown={handleKeyDown} />
        <TextField fullWidth multiline label="About Section" name="aboutSection" value={program.aboutSection} onChange={handleChange} onKeyDown={handleKeyDown} />
        <TextField fullWidth label="Video Embed Url" name="videoEmbedUrl" value={program.videoEmbedUrl} onChange={handleChange} onKeyDown={handleKeyDown} />
        {program.id && <Link href={"/admin/categories/" + program.id.toString()}>Edit Categories</Link>}
      </InputBox>
    </>
  );
}
