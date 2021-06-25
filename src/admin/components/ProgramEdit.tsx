import React from "react";
import { ApiHelper, GroupInterface, InputBox, ErrorMessages, ProgramInterface } from ".";
import { Redirect } from "react-router-dom";
import { Row, Col, FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  program: ProgramInterface,
  updatedCallback: (program: ProgramInterface) => void,
  toggleImageEditor: (show: boolean) => void,
}

export const ProgramEdit: React.FC<Props> = (props) => {
  const [program, setProgram] = React.useState<ProgramInterface>({} as ProgramInterface);
  const [errors, setErrors] = React.useState([]);
  const [redirect, setRedirect] = React.useState("");

  const handleCancel = () => props.updatedCallback(program);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let p = { ...program };
    switch (e.currentTarget.name) {
      case "name": p.name = e.currentTarget.value; break;
    }
    setProgram(p);
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
      ApiHelper.delete("/programs/" + program.id.toString(), "LessonsApi").then(() => setRedirect("/admin"));
    }
  }


  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.toggleImageEditor(true);
  }


  React.useEffect(() => { setProgram(props.program) }, [props.program]);

  if (redirect !== "") return <Redirect to={redirect} />
  else return (
    <InputBox id="programDetailsBox" headerText="Edit Program" headerIcon="fas fa-list" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <Row>
        <Col sm={3}>
          <a href="about:blank" className="d-block" onClick={handleImageClick}>
            <img src={program.image || "/images/blank.png"} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="program photo" />
          </a>
        </Col>
        <Col sm={9}>
          <FormGroup>
            <FormLabel>Program Name</FormLabel>
            <FormControl type="text" name="name" value={program.name} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
      </Row>
    </InputBox>
  );
}
