import { useState, useEffect } from "react";
import Image from "next/image";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { ErrorMessages, InputBox, ImageEditor } from "../index";
import { ApiHelper, ProgramInterface } from "@/utils";

type Props = {
  program: ProgramInterface;
  updatedCallback: (program: ProgramInterface) => void;
};

export function ProgramEdit(props: Props) {
  const [program, setProgram] = useState<ProgramInterface>(
    {} as ProgramInterface
  );
  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);

  const handleCancel = () => props.updatedCallback(program);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    let p = { ...program };
    switch (e.currentTarget.name) {
      case "live":
        p.live = e.currentTarget.value === "true";
        break;
      case "name":
        p.name = e.currentTarget.value;
        break;
      case "slug":
        p.slug = e.currentTarget.value;
        break;
      case "shortDescription":
        p.shortDescription = e.currentTarget.value;
        break;
      case "description":
        p.description = e.currentTarget.value;
        break;
      case "aboutSection":
        p.aboutSection = e.currentTarget.value;
        break;
      case "videoEmbedUrl":
        p.videoEmbedUrl = e.currentTarget.value;
        break;
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
    if (
      window.confirm(
        "Are you sure you wish to permanently delete this program?"
      )
    ) {
      ApiHelper.delete("/programs/" + program.id.toString(), "LessonsApi").then(
        () => props.updatedCallback(null)
      );
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  };

  useEffect(() => {
    setProgram(props.program);
  }, [props.program]);

  const getImageEditor = () => {
    if (showImageEditor)
      return (
        <ImageEditor
          updatedFunction={handleImageUpdated}
          imageUrl={program.image}
          onCancel={() => setShowImageEditor(false)}
        />
      );
  };

  return (
    <>
      {getImageEditor()}
      <InputBox
        id="programDetailsBox"
        headerText="Edit Program"
        headerIcon="fas fa-graduation-cap"
        saveFunction={handleSave}
        cancelFunction={handleCancel}
        deleteFunction={handleDelete}
      >
        <ErrorMessages errors={errors} />
        <a href="about:blank" className="d-block" onClick={handleImageClick}>
          <Image
            src={program.image || "/images/blank.png"}
            className="img-fluid profilePic d-block mx-auto"
            id="imgPreview"
            alt="program"
            height={185}
            width={330}
          />
        </a>
        <br />
        <FormGroup>
          <FormLabel>Live</FormLabel>
          <FormControl
            as="select"
            name="live"
            value={program.live?.toString()}
            onChange={handleChange}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Program Name</FormLabel>
          <FormControl
            type="text"
            name="name"
            value={program.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Url Slug</FormLabel>
          <div>
            <a
              href={"https://lessons.church/" + program.slug + "/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {"https://lessons.church/" + program.slug + "/"}
            </a>
          </div>
          <FormControl
            type="text"
            name="slug"
            value={program.slug}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>One-Line Description</FormLabel>
          <FormControl
            type="text"
            name="shortDescription"
            value={program.shortDescription}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Description</FormLabel>
          <FormControl
            as="textarea"
            type="text"
            name="description"
            value={program.description}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>About Section</FormLabel>
          <FormControl
            as="textarea"
            type="text"
            name="aboutSection"
            value={program.aboutSection}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Video Embed Url</FormLabel>
          <FormControl
            type="text"
            name="videoEmbedUrl"
            value={program.videoEmbedUrl}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
      </InputBox>
    </>
  );
}