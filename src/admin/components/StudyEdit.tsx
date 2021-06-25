import React from "react";
import { ApiHelper, InputBox, ErrorMessages, StudyInterface } from ".";
import { Redirect } from "react-router-dom";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  study: StudyInterface,
  updatedCallback: (study: StudyInterface) => void
}

export const StudyEdit: React.FC<Props> = (props) => {
  const [study, setStudy] = React.useState<StudyInterface>({} as StudyInterface);
  const [errors, setErrors] = React.useState([]);
  const [showImageEditor, setShowImageEditor] = React.useState<boolean>(false);

  const handleCancel = () => props.updatedCallback(study);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let p = { ...study };
    switch (e.currentTarget.name) {
      case "name": p.name = e.currentTarget.value; break;
      case "shortDescription": p.shortDescription = e.currentTarget.value; break;
      case "description": p.description = e.currentTarget.value; break;
      case "videoEmbedUrl": p.videoEmbedUrl = e.currentTarget.value; break;
    }
    setStudy(p);
  }

  const handleImageUpdated = (dataUrl: string) => {
    const s = { ...study };
    s.image = dataUrl;
    setStudy(s);
    setShowImageEditor(false);
  }

  const validate = () => {
    let errors = [];
    if (study.name === "") errors.push("Please enter a study name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/studies", [study], "LessonsApi").then(data => {
        setStudy(data);
        props.updatedCallback(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this study?")) {
      ApiHelper.delete("/studies/" + study.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  }

  React.useEffect(() => { setStudy(props.study) }, [props.study]);

  return (<>
    <InputBox id="studyDetailsBox" headerText="Edit Study" headerIcon="fas fa-list" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />

      <a href="about:blank" className="d-block" onClick={handleImageClick}>
        <img src={study.image || "/images/blank.png"} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="study" />
      </a><br />
      <FormGroup>
        <FormLabel>Study Name</FormLabel>
        <FormControl type="text" name="name" value={study.name} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
      <FormGroup>
        <FormLabel>One-Line Description</FormLabel>
        <FormControl type="text" name="shortDescription" value={study.shortDescription} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
      <FormGroup>
        <FormLabel>Description</FormLabel>
        <FormControl as="textarea" type="text" name="description" value={study.description} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
      <FormGroup>
        <FormLabel>Video Embed Url</FormLabel>
        <FormControl type="text" name="videoEmbedUrl" value={study.videoEmbedUrl} onChange={handleChange} onKeyDown={handleKeyDown} />
      </FormGroup>
    </InputBox>
  </>);
}
