import { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { Cancel as CancelIcon, ContentCopy as CopyIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, CopySectionInterface, SectionInterface, VenueInterface } from "@/helpers";

interface Props {
  copySection: CopySectionInterface;
  venueId: string;
  updatedCallback: () => void;
}

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
      ApiHelper.get("/sections/copy/" + copySection.sourceSectionId + "/" + props.venueId, "LessonsApi").then(data => {
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
  };

  const populateSections = () => {
    ApiHelper.get("/sections/venue/" + copySection.sourceVenueId, "LessonsApi").then((data: SectionInterface[]) => {
      setSections(data);
      if (data.length > 0) {
        const cs = { ...copySection };
        cs.sourceSectionId = data[0].id;
        setCopySection(cs);
      }
    });
  };

  const getVenueOptions = () => {
    const result: React.JSX.Element[] = [];
    venues.forEach(v => {
      result.push(<MenuItem value={v.id}>{v.name}</MenuItem>);
    });
    return result;
  };

  const getSectionOptions = () => {
    const result: React.JSX.Element[] = [];
    sections.forEach(s => {
      result.push(<MenuItem value={s.id}>{s.name}</MenuItem>);
    });
    return result;
  };

  useEffect(init, [props.copySection.sourceLessonId]);
  useEffect(populateSections, [copySection.sourceVenueId]);

  //return (<div>Hello WOrld</div>)

  return (
    <Paper
      sx={{
        borderRadius: 2,
        border: '1px solid var(--admin-border)',
        boxShadow: 'var(--admin-shadow-sm)',
        overflow: 'hidden'
      }}>
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid var(--admin-border)',
          backgroundColor: 'var(--c1l7)'
        }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CopyIcon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
          <Typography variant="h6" sx={{
            color: 'var(--c1d2)',
            fontWeight: 600,
            lineHeight: 1,
            fontSize: '1.25rem'
          }}>
            Copy Section From
          </Typography>
        </Stack>
      </Box>

      {/* CONTENT */}
      <Box sx={{ p: 3 }}>
        <ErrorMessages errors={errors} />

        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Venue</InputLabel>
            <Select
              label="Venue"
              name="venue"
              value={copySection.sourceVenueId || ''}
              onChange={handleChange}>
              {getVenueOptions()}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Section</InputLabel>
            <Select
              label="Section"
              name="section"
              value={copySection.sourceSectionId || ''}
              onChange={handleChange}>
              {getSectionOptions()}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid var(--admin-border)',
          backgroundColor: 'var(--admin-bg)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          flexWrap: 'wrap'
        }}>
        <Button startIcon={<CopyIcon />} variant="contained" onClick={handleSave}>
          Copy Section
        </Button>
        <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}
