import { useEffect, useState } from "react";
import { SelectChangeEvent, TextField } from "@mui/material";
import { ErrorMessages, InputBox } from "@churchapps/apphelper";
import { FeedVenueLinkInterface } from "@/helpers";

interface Props {
  venue: FeedVenueLinkInterface;
  updatedCallback: (venue: FeedVenueLinkInterface, cancelled: boolean) => void;
}

export function OllVenueEdit(props: Props) {
  const [venue, setVenue] = useState<FeedVenueLinkInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let v = { ...venue };
    switch (e.target.name) {
      case "id":
        v.id = e.target.value;
        break;
      case "name":
        v.name = e.target.value;
        break;
      case "apiUrl":
        v.apiUrl = e.target.value;
        break;
    }
    setVenue(v);
  };

  const validate = () => {
    let errors = [];
    if (venue.name === "") errors.push("Please enter a name.");
    if (venue.id === "") errors.push("Please enter an id.");
    if (venue.apiUrl === "") errors.push("Please enter an api url.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) props.updatedCallback(venue, false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this venue?")) props.updatedCallback(null, false);
  };

  useEffect(() => {
    setVenue(props.venue);
  }, [props.venue]);

  if (!venue) {
    return <></>;
  } else {
    return (
      <>
        <InputBox
          id="venueDetailsBox"
          headerText={props.venue ? "Edit Venue" : "Create Venue"}
          headerIcon="check"
          saveFunction={handleSave}
          cancelFunction={handleCancel}
          deleteFunction={handleDelete}>
          <ErrorMessages errors={errors} />
          <TextField fullWidth label="Id" name="id" value={venue.id} onChange={handleChange} />
          <TextField fullWidth label="Name" name="name" value={venue.name} onChange={handleChange} />
          <TextField fullWidth label="API Url" name="apiUrl" value={venue.apiUrl} onChange={handleChange} />
        </InputBox>
      </>
    );
  }
}
