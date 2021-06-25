import React from "react";
import { ApiHelper, InputBox, ErrorMessages, ProgramInterface, ImageEditor } from ".";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  program: ProgramInterface,
  updatedCallback: (program: ProgramInterface) => void
}

export const ProgramEdit: React.FC<Props> = (props) => {
  const [program, setProgram] = React.useState<ProgramInterface>({} as ProgramInterface);
  const [errors, setErrors] = React.useState([]);
  const [showImageEditor, setShowImageEditor] = React.useState<boolean>(false);

  const handleCancel = () => props.updatedCallback(program);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let p = { ...program };
    switch (e.currentTarget.name) {
      case "name": p.name = e.currentTarget.value; break;
      case "shortDescription": p.shortDescription = e.currentTarget.value; break;
      case "description": p.description = e.currentTarget.value; break;
      case "videoEmbedUrl": p.videoEmbedUrl = e.currentTarget.value; break;
    }
    setProgram(p);
  }

  const handleImageUpdated = (dataUrl: string) => {
    const p = { ...program };
    p.image = dataUrl;
    setProgram(p);
    setShowImageEditor(false);
  }

  const validate = () => {
    let errors = [];
    if (program.name === "") errors.push("Please enter a program name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/programs", [program], "LessonsApi").then(data => {
        setProgram(data);
        props.updatedCallback(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this program?")) {
      ApiHelper.delete("/programs/" + program.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  }


  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  }


  React.useEffect(() => { setProgram(props.program) }, [props.program]);


  const getImageEditor = () => {
    if (showImageEditor) return (<ImageEditor updatedFunction={handleImageUpdated} imageUrl={program.image} onCancel={() => setShowImageEditor(false)} />)
  }


  return (<>
    {getImageEditor()}
    <InputBox id="programDetailsBox" headerText="Edit Program" headerIcon="fas fa-list" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <a href="about:blank" className="d-block" onClick={handleImageClick}>
        <img src={program.image || "/images/blank.png"} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="program" />
      </a><br />
      <FormGroup>
        <FormLabel>Program Name</FormLabel>
        <FormControl type="text" name="name" value={program.name} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
      <FormGroup>
        <FormLabel>One-Line Description</FormLabel>
        <FormControl type="text" name="shortDescription" value={program.shortDescription} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>

      <FormGroup>
        <FormLabel>Description</FormLabel>
        <FormControl as="textarea" type="text" name="description" value={program.description} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
      <FormGroup>
        <FormLabel>Video Embed Url</FormLabel>
        <FormControl type="text" name="videoEmbedUrl" value={program.videoEmbedUrl} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
    </InputBox>
  </>);
}
