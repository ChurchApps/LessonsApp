import React from "react";
import { ApiHelper, InputBox, ErrorMessages, VenueInterface } from ".";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
  venue: VenueInterface,
  updatedCallback: (venue: VenueInterface) => void
}

export const VenueEdit: React.FC<Props> = (props) => {
  const [venue, setVenue] = React.useState<VenueInterface>({} as VenueInterface);
  const [errors, setErrors] = React.useState([]);

  const handleCancel = () => props.updatedCallback(venue);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let v = { ...venue };
    switch (e.currentTarget.name) {
      case "name": v.name = e.currentTarget.value; break;
      case "sort": v.sort = parseInt(e.currentTarget.value); break;
    }
    setVenue(v);
  }

  const validate = () => {
    let errors = [];
    if (venue.name === "") errors.push("Please enter a venue name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/venues", [venue], "LessonsApi").then(data => {
        setVenue(data);
        props.updatedCallback(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this venue?")) {
      ApiHelper.delete("/venues/" + venue.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  }

  React.useEffect(() => { setVenue(props.venue) }, [props.venue]);


  return (<>
    <InputBox id="venueDetailsBox" headerText="Edit Venue" headerIcon="fas fa-map-marker" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <FormGroup>
        <FormLabel>Order</FormLabel>
        <FormControl type="number" name="sort" value={venue.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
      </FormGroup>
      <FormGroup>
        <FormLabel>Venue Name</FormLabel>
        <FormControl type="text" name="name" value={venue.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Venue 1" />
      </FormGroup>
    </InputBox>
  </>);
}
