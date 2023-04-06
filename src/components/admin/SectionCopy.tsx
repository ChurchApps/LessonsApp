import { useState, useEffect } from "react";
import { ApiHelper, CopySectionInterface, SectionInterface, VenueInterface } from "@/utils";
import { InputBox, ErrorMessages } from "../index";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

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

  const handleChange = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    let s = { ...copySection };
    switch (e.target.name) {
      case "venue":
        s.sourceVenueId = e.target.value;
        break;
      case "section":
        s.sourceSectionId = e.target.value;
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
        setCopySection(cs);
      }
    });
  }

  const populateSections = () => {
    ApiHelper.get("/sections/venue/" + copySection.sourceVenueId, "LessonsApi").then((data: SectionInterface[]) => {
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
      result.push(<MenuItem value={v.id}>{v.name}</MenuItem>)
    });
    return result;
  }

  const getSectionOptions = () => {
    const result: JSX.Element[] = []
    sections.forEach(s => {
      result.push(<MenuItem value={s.id}>{s.name}</MenuItem>)
    });
    return result;
  }

  useEffect(init, [props.copySection.sourceLessonId]);
  useEffect(populateSections, [copySection.sourceVenueId]);

  //return (<div>Hello WOrld</div>)



  return (
    <>
      <InputBox id="sectionDetailsBox" headerText="Copy Section From" headerIcon="list_alt" saveFunction={handleSave} cancelFunction={handleCancel} saveText="Copy!">
        <ErrorMessages errors={errors} />

        <FormControl fullWidth>
          <InputLabel>Venue</InputLabel>
          <Select label="Venue" name="venue" value={copySection.sourceVenueId} onChange={handleChange}>
            {getVenueOptions()}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Section</InputLabel>
          <Select label="Section" name="section" value={copySection.sourceSectionId} onChange={handleChange}>
            {getSectionOptions()}
          </Select>
        </FormControl>
      </InputBox>
    </>
  );
}
