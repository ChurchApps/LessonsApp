import React from "react";
import { ApiHelper, InputBox, ErrorMessages, StudyInterface } from ".";
import { Redirect } from "react-router-dom";
import { Row, Col, FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props { study: StudyInterface, updatedCallback: (study: StudyInterface) => void }

export const StudyEdit: React.FC<Props> = (props) => {
  const [study, setStudy] = React.useState<StudyInterface>({} as StudyInterface);
  const [errors, setErrors] = React.useState([]);
  const [redirect, setRedirect] = React.useState("");

  const handleCancel = () => props.updatedCallback(study);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let p = { ...study };
    switch (e.currentTarget.name) {
      case "name": p.name = e.currentTarget.value; break;
    }
    setStudy(p);
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
      ApiHelper.delete("/studies/" + study.id.toString(), "LessonsApi").then(() => setRedirect("/admin"));
    }
  }

  React.useEffect(() => { setStudy(props.study) }, [props.study]);

  if (redirect !== "") return <Redirect to={redirect} />
  else return (
    <InputBox id="studyDetailsBox" headerText="Edit Study" headerIcon="fas fa-list" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <Row>
        <Col>
          <FormGroup>
            <FormLabel>Study Name</FormLabel>
            <FormControl type="text" name="name" value={study.name} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Col>
      </Row>
    </InputBox>
  );
}
