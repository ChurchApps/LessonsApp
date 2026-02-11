import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Delete as DeleteIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { FeedSectionInterface } from "@/helpers";

interface Props {
  section: FeedSectionInterface;
  updatedCallback: (section: FeedSectionInterface, cancelled: boolean) => void;
}

export function OlfSectionEdit(props: Props) {
  const [section, setSection] = useState<FeedSectionInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    const s = { ...section };
    switch (e.target.name) {
      case "name":
        s.name = e.target.value;
        break;
    }
    setSection(s);
  };

  const validate = () => {
    const errors = [];
    if (section.name === "") errors.push("Please enter a name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) props.updatedCallback(section, false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this section?")) props.updatedCallback(null, false);
  };

  useEffect(() => {
    setSection(props.section);
  }, [props.section]);

  if (!section) {
    return <></>;
  } else {
    return (
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
              {props.section.name?.trim() ? "Edit Section" : "Create Section"}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: 3 }}>
          <ErrorMessages errors={errors} />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={section.name || ""}
            onChange={handleChange}
            required
          />
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
          {props.section.name?.trim() && (
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
    );
  }
}
