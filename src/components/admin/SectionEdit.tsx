import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { List as ListIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, SectionInterface } from "@/helpers";

interface Props {
  section: SectionInterface;
  updatedCallback: (section: SectionInterface, created: boolean) => void;
}

export function SectionEdit(props: Props) {
  const [section, setSection] = useState<SectionInterface>({} as SectionInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(section, false);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    const s = { ...section };
    switch (e.currentTarget.name) {
      case "name":
        s.name = e.currentTarget.value;
        break;
      case "materials":
        s.materials = e.currentTarget.value;
        break;
      case "sort":
        s.sort = parseInt(e.currentTarget.value);
        break;
    }
    setSection(s);
  };

  const validate = () => {
    const errors = [];
    if (section.name === "") errors.push("Please enter a section name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/sections", [section], "LessonsApi").then(data => {
        setSection(data);
        props.updatedCallback(data[0], !props.section.id);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this section?")) {
      ApiHelper.delete("/sections/" + section.id.toString(), "LessonsApi").then(() =>
        props.updatedCallback(null, false));
    }
  };

  useEffect(() => {
    setSection(props.section);
  }, [props.section]);

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
          <ListIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{
            color: "var(--c1d2)",
            fontWeight: 600,
            lineHeight: 1,
            fontSize: "1.25rem"
          }}>
            {section?.id ? "Edit Section" : "Create Section"}
          </Typography>
        </Stack>
      </Box>

      {/* CONTENT */}
      <Box sx={{ p: 3 }}>
        <ErrorMessages errors={errors} />

        <Stack spacing={3}>
          <TextField
            label="Order"
            fullWidth
            type="number"
            name="sort"
            value={section.sort || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="1"
            helperText="Display order for this section"
          />

          <TextField
            label="Section Name"
            fullWidth
            name="name"
            value={section.name || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Section 1"
            required
          />

          <TextField
            label="Materials Needed"
            fullWidth
            multiline
            rows={2}
            name="materials"
            value={section.materials || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="List any materials needed for this section"
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
        {section.id && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
