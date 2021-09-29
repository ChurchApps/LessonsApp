import { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { ApiHelper, CopySectionInterface, SectionInterface, VenueInterface } from "@/utils";
import { InputBox, ErrorMessages } from "../index";

type Props = {
  copySection: CopySectionInterface,
  venueId: string,
  updatedCallback: () => void
};

export function SectionCopy(props: Props) {
  const [copySection, setCopySection] = useState<CopySectionInterface>({} as CopySectionInterface);
  const [errors, setErrors] = useState([]);

  const [venues, setVenues] = useState<VenueInterface[]>([]);
  const [sections, setSections] = useState<SectionInterface[]>([]);


  const handleCancel = () => props.updatedCallback();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let s = { ...copySection };
    switch (e.currentTarget.name) {
      case "venue":
        s.sourceVenueId = e.currentTarget.value;
        break;
      case "section":
        s.sourceSectionId = e.currentTarget.value;
        break;
    }
    setCopySection(s);
  };

  const validate = () => {
    let errors = [];
    if (!copySection.sourceSectionId) errors.push("No section to copy from");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.get("/sections/copy/" + copySection.sourceSectionId + "/" + props.venueId, "LessonsApi").then((data) => {
        props.updatedCallback();
      });
    }
  };

  const init = () => {
    setCopySection(props.copySection);

    ApiHelper.get("/venues/lesson/" + props.copySection.sourceLessonId, "LessonsApi").then((data: VenueInterface[]) => {
      setVenues(data);
      if (data.length > 0) {
        const cs = { ...copySection };
        cs.sourceVenueId = data[0].id;
        console.log("Setting source venue id to: " + cs.sourceVenueId);
        setCopySection(cs);
      }
    });
  }

  const populateSections = () => {
    console.log("loading sections");
    ApiHelper.get("/sections/venue/" + copySection.sourceVenueId, "LessonsApi").then((data: SectionInterface[]) => {
      console.log("loaded sections");
      console.log(data);
      setSections(data);
      if (data.length > 0) {
        const cs = { ...copySection };
        cs.sourceSectionId = data[0].id;
        setCopySection(cs);
      }
    });
  }

  const getVenueOptions = () => {
    const result: JSX.Element[] = []
    venues.forEach(v => {
      result.push(<option value={v.id}>{v.name}</option>)
    });
    return result;
  }

  const getSectionOptions = () => {
    const result: JSX.Element[] = []
    sections.forEach(s => {
      result.push(<option value={s.id}>{s.name}</option>)
    });
    return result;
  }

  useEffect(init, [props.copySection.sourceLessonId]);
  useEffect(populateSections, [copySection.sourceVenueId]);

  //return (<div>Hello WOrld</div>)



  return (
    <>
      <InputBox id="sectionDetailsBox" headerText="Copy Section From" headerIcon="fas fa-tasks" saveFunction={handleSave} cancelFunction={handleCancel} saveText="Copy!" >
        <ErrorMessages errors={errors} />
        <FormGroup>
          <FormLabel>Venue</FormLabel>
          <FormControl as="select" name="venue" value={copySection.sourceVenueId} onChange={handleChange}>
            {getVenueOptions()}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Section</FormLabel>
          <FormControl as="select" name="section" value={copySection.sourceSectionId} onChange={handleChange}>
            {getSectionOptions()}
          </FormControl>
        </FormGroup>
      </InputBox>
    </>
  );
}
