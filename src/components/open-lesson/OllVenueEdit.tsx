import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Delete as DeleteIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
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
        <Paper
          sx={{
            borderRadius: 2,
            border: "1px solid var(--admin-border)",
            boxShadow: "var(--admin-shadow-sm)",
            overflow: "hidden"
          }}>
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid var(--admin-border)",
              backgroundColor: "var(--c1l7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EditIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
              <Typography
                variant="h6"
                sx={{
                  color: "var(--c1d2)",
                  fontWeight: 600,
                  lineHeight: 1,
                  fontSize: "1.25rem"
                }}>
                {props.venue.id ? "Edit Venue" : "Create Venue"}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: 3 }}>
            <ErrorMessages errors={errors} />
            <Stack spacing={3}>
              <TextField fullWidth label="Id" name="id" value={venue.id || ""} onChange={handleChange} required />
              <TextField fullWidth label="Name" name="name" value={venue.name || ""} onChange={handleChange} required />
              <TextField fullWidth label="API Url" name="apiUrl" value={venue.apiUrl || ""} onChange={handleChange} required />
            </Stack>
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid var(--admin-border)",
              backgroundColor: "var(--admin-bg)",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              flexWrap: "wrap"
            }}>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: "var(--c1)",
                "&:hover": { backgroundColor: "var(--c1d1)" }
              }}>
            Save
            </Button>
            <Button
              startIcon={<CancelIcon />}
              variant="outlined"
              onClick={handleCancel}
              sx={{
                color: "var(--c1d2)",
                borderColor: "var(--c1d2)"
              }}>
            Cancel
            </Button>
            {props.venue.id && (
              <IconButton
                color="error"
                onClick={handleDelete}
                sx={{
                  color: "#d32f2f",
                  "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" }
                }}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Paper>
      </>
    );
  }
}
