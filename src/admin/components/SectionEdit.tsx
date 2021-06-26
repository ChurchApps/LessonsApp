import React from "react";
import { ApiHelper, InputBox, ErrorMessages, SectionInterface } from ".";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  section: SectionInterface,
  updatedCallback: (section: SectionInterface) => void
}

export const SectionEdit: React.FC<Props> = (props) => {
  const [section, setSection] = React.useState<SectionInterface>({} as SectionInterface);
  const [errors, setErrors] = React.useState([]);

  const handleCancel = () => props.updatedCallback(section);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let s = { ...section };
    switch (e.currentTarget.name) {
      case "name": s.name = e.currentTarget.value; break;
      case "sort": s.sort = parseInt(e.currentTarget.value); break;
    }
    setSection(s);
  }

  const validate = () => {
    let errors = [];
    if (section.name === "") errors.push("Please enter a section name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/sections", [section], "LessonsApi").then(data => {
        setSection(data);
        props.updatedCallback(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this section?")) {
      ApiHelper.delete("/sections/" + section.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  }

  React.useEffect(() => { setSection(props.section) }, [props.section]);


  return (<>
    <InputBox id="sectionDetailsBox" headerText="Edit Section" headerIcon="fas fa-map-marker" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <FormGroup>
        <FormLabel>Order</FormLabel>
        <FormControl type="number" name="sort" value={section.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Section Name</FormLabel>
        <FormControl type="text" name="name" value={section.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Section 1" />
      </FormGroup>
    </InputBox>
  </>);
}
