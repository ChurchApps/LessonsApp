import { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel, Row, Col } from "react-bootstrap";
import { InputBox, ErrorMessages, ImageEditor } from "../index";
import { ApiHelper, StudyInterface, ProgramInterface } from "@/utils";

type Props = {
  study: StudyInterface;
  updatedCallback: (study: StudyInterface) => void;
};

export function StudyEdit(props: Props) {
  const [study, setStudy] = useState<StudyInterface>({});
  const [program, setProgram] = useState<ProgramInterface>({});
  const [errors, setErrors] = useState([]);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);

  const handleCancel = () => props.updatedCallback(study);
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
    let p = { ...study };
    switch (e.currentTarget.name) {
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
      case "videoEmbedUrl":
        p.videoEmbedUrl = e.currentTarget.value;
        break;
      case "live":
        p.live = e.currentTarget.value === "true";
        break;
      case "sort":
        p.sort = parseInt(e.currentTarget.value);
        break;
    }
    setStudy(p);
  };

  const loadProgram = (programId: string) => {
    ApiHelper.get("/programs/" + programId, "LessonsApi").then(
      (data: ProgramInterface) => {
        setProgram(data);
      }
    );
  };

  const handleImageUpdated = (dataUrl: string) => {
    const s = { ...study };
    s.image = dataUrl;
    setStudy(s);
    setShowImageEditor(false);
  };

  const validate = () => {
    let errors = [];
    if (study.name === "") errors.push("Please enter a study name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/studies", [study], "LessonsApi").then((data) => {
        setStudy(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (
      window.confirm("Are you sure you wish to permanently delete this study?")
    ) {
      ApiHelper.delete("/studies/" + study.id.toString(), "LessonsApi").then(
        () => props.updatedCallback(null)
      );
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageEditor(true);
  };

  useEffect(() => {
    setStudy(props.study);
    loadProgram(props.study.programId);
  }, [props.study]);

  const getImageEditor = () => {
    if (showImageEditor)
      return (
        <ImageEditor
          updatedFunction={handleImageUpdated}
          imageUrl={study.image}
          onCancel={() => setShowImageEditor(false)}
        />
      );
  };

  return (
    <>
      {getImageEditor()}
      <InputBox
        id="studyDetailsBox"
        headerText="Edit Study"
        headerIcon="fas fa-layer-group"
        saveFunction={handleSave}
        cancelFunction={handleCancel}
        deleteFunction={handleDelete}
      >
        <ErrorMessages errors={errors} />

        <a href="about:blank" className="d-block" onClick={handleImageClick}>
          <img
            src={study.image || "/images/blank.png"}
            className="img-fluid profilePic d-block mx-auto"
            id="imgPreview"
            alt="study"
          />
        </a>
        <br />
        <Row>
          <Col>
            <FormGroup>
              <FormLabel>Live</FormLabel>
              <FormControl
                as="select"
                name="live"
                value={study.live?.toString()}
                onChange={handleChange}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </FormControl>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <FormLabel>Order</FormLabel>
              <FormControl
                type="number"
                name="sort"
                value={study.sort}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="1"
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <FormLabel>Study Name</FormLabel>
          <FormControl
            type="text"
            name="name"
            value={study.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Url Slug</FormLabel>
          <div>
            <a
              href={
                "https://lessons.church/" +
                program?.slug +
                "/" +
                study.slug +
                "/"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {"https://lessons.church/" +
                program?.slug +
                "/" +
                study.slug +
                "/"}
            </a>
          </div>
          <FormControl
            type="text"
            name="slug"
            value={study.slug}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>One-Line Description</FormLabel>
          <FormControl
            type="text"
            name="shortDescription"
            value={study.shortDescription}
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
            value={study.description}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Video Embed Url</FormLabel>
          <FormControl
            type="text"
            name="videoEmbedUrl"
            value={study.videoEmbedUrl}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
      </InputBox>
    </>
  );
}
