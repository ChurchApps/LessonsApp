import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { LocationOn as LocationIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, VenueInterface } from "@/helpers";

interface Props {
  venue: VenueInterface;
  updatedCallback: (venue: VenueInterface) => void;
}

export function VenueEdit(props: Props) {
  const [venue, setVenue] = useState<VenueInterface>({} as VenueInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(venue);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    const v = { ...venue };
    switch (e.currentTarget.name) {
      case "name":
        v.name = e.currentTarget.value;
        break;
      case "sort":
        v.sort = parseInt(e.currentTarget.value);
        break;
    }
    setVenue(v);
  };

  const validate = () => {
    const errors = [];
    if (venue.name === "") errors.push("Please enter a venue name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/venues", [venue], "LessonsApi").then(data => {
        setVenue(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this venue?")) ApiHelper.delete("/venues/" + venue.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  useEffect(() => {
    setVenue(props.venue);
  }, [props.venue]);

  return (
    <Paper
      sx={{
        borderRadius: 2,
        border: "1px solid var(--admin-border)",
        boxShadow: "var(--admin-shadow-sm)",
        overflow: "hidden"
      }}>
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid var(--admin-border)",
          backgroundColor: "var(--c1l7)"
        }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{
            color: "var(--c1d2)",
            fontWeight: 600,
            lineHeight: 1,
            fontSize: "1.25rem"
          }}>
            Edit Venue
          </Typography>
        </Stack>
      </Box>

      {/* CONTENT */}
      <Box sx={{ p: 3 }}>
        <ErrorMessages errors={errors} />

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Order"
            type="number"
            name="sort"
            value={venue.sort || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="1"
            helperText="Display order for this venue"
          />

          <TextField
            fullWidth
            label="Venue Name"
            name="name"
            value={venue.name || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Small Group"
            required
          />
        </Stack>
      </Box>

      {/* FOOTER */}
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
        <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        {venue.id && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
