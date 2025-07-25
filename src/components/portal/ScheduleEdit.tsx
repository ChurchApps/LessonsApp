import { useEffect, useState } from "react";
import { CalendarMonth as CalendarIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  Print as PrintIcon,
  Save as SaveIcon } from "@mui/icons-material";
import { Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography } from "@mui/material";
import { ArrayHelper, DateHelper, ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, ExternalProviderInterface, LessonTreeInterface, ScheduleInterface } from "@/helpers";

interface Props {
  schedule: ScheduleInterface;
  schedules: ScheduleInterface[];
  updatedCallback: (schedule: ScheduleInterface) => void;
}

export function ScheduleEdit(props: Props) {
  const [schedule, setSchedule] = useState<ScheduleInterface>(props.schedule);
  const [errors, setErrors] = useState<string[]>([]);

  const [externalProviders, setExternalProviders] = useState<ExternalProviderInterface[]>([]);

  const [lessonTree, setLessonTree] = useState<LessonTreeInterface>({});

  const getDefault = (array: Array<{ id: string }>, id: string) => {
    let result = id;
    if (array && (!id || !ArrayHelper.getOne(array, "id", id))) result = array[0].id;
    return result;
  };

  const getLessonId = (array: Array<{ id: string }>, id: string) => {
    let result = id;
    if (id === "default") {
      result = getDefault(array, id);
    } else if (id === "next") {
      const index = ArrayHelper.getIndex(array, "id", props.schedules[0].lessonId);
      const newIndex = index + 1;
      if (newIndex < array.length) result = array[newIndex].id;
    } else {
      result = id;
    }
    return result;
  };

  const s = { ...schedule };

  if (lessonTree) s.programId = getDefault(lessonTree.programs, s.programId);
  const currentProgram = ArrayHelper.getOne(lessonTree?.programs || [], "id", s.programId);

  if (currentProgram) s.studyId = getDefault(currentProgram.studies, s.studyId);
  const currentStudy = ArrayHelper.getOne(currentProgram?.studies || [], "id", s.studyId);

  if (currentStudy) s.lessonId = getLessonId(currentStudy.lessons, s.lessonId);
  const currentLesson = ArrayHelper.getOne(currentStudy?.lessons || [], "id", s.lessonId);

  if (currentLesson) s.venueId = getDefault(currentLesson.venues, s.venueId);
  //const currentVenue = ArrayHelper.getOne(currentLesson?.venues || [], "id", s.venueId);

  if (JSON.stringify(s) !== JSON.stringify(schedule)) setSchedule(s);

  const loadExternalProviderData = async (externalProviders: ExternalProviderInterface[],
    externalProviderId: string) => {
    const ep: ExternalProviderInterface = ArrayHelper.getOne(externalProviders, "id", externalProviderId);
    const data = await ApiHelper.fetchWithErrorHandling(ep.apiUrl, { method: "GET" });
    setLessonTree(data);
  };

  const loadExternalProviders = async () => {
    const data = await ApiHelper.get("/externalProviders", "LessonsApi");
    setExternalProviders(data);
    return data;
  };

  const loadInternal = async () => {
    const data = await ApiHelper.getAnonymous("/lessons/public/tree", "LessonsApi");
    setLessonTree(data);
    return data;
  };

  const handleCancel = () => props.updatedCallback(schedule);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleProviderChange = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    let s = { ...schedule };
    s.externalProviderId = e.target.value.replace("lessons.church", "");
    if (s.externalProviderId === "") loadInternal();
    else loadExternalProviderData(externalProviders, e.target.value);
    setSchedule(s);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let s = { ...schedule };
    switch (e.target.name) {
    case "scheduledDate": s.scheduledDate = new Date(e.target.value); break;
    case "program": s.programId = e.target.value; break;
    case "study": s.studyId = e.target.value; break;
    case "lesson": s.lessonId = e.target.value; break;
    case "venue": s.venueId = e.target.value; break;
    }
    setSchedule(s);
  };

  const validate = () => {
    let errors = [];
    if (schedule.scheduledDate === null) errors.push("Please enter a schedule name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const getDisplayName = () => {
    const studyName = currentStudy?.name;
    const lessonName = currentLesson.name;
    return studyName + " - " + lessonName;
  };

  const handleSave = () => {
    if (validate()) {
      const s = { ...schedule };
      s.displayName = getDisplayName();

      ApiHelper.post("/schedules", [s], "LessonsApi").then(data => {
        setSchedule(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this schedule?")) ApiHelper.delete("/schedules/" + schedule.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  const getProviderOptions = () => {
    const result: JSX.Element[] = [];
    result.push(<MenuItem value="lessons.church">Lessons.church</MenuItem>);
    externalProviders.forEach(p => result.push(<MenuItem value={p.id}>{p.name}</MenuItem>));
    return result;
  };

  const getProgramOptions = () => {
    const result: JSX.Element[] = [];
    lessonTree?.programs?.forEach((p: any) => result.push(<MenuItem value={p.id}>{p.name}</MenuItem>));
    return result;
  };

  const getStudyOptions = () => {
    const result: JSX.Element[] = [];
    currentProgram?.studies?.forEach((s: any) => result.push(<MenuItem value={s.id}>{s.name}</MenuItem>));
    return result;
  };

  const getLessonOptions = () => {
    const result: JSX.Element[] = [];
    currentStudy?.lessons?.forEach((l: any) => {
      let sx: any = {};
      const existing: ScheduleInterface = ArrayHelper.getOne(props.schedules, "lessonId", l.id);
      if (existing && existing?.scheduledDate !== schedule.scheduledDate) sx.color = "#999";
      result.push(<MenuItem value={l.id} sx={sx}>
        {l.name}
      </MenuItem>);
    });
    return result;
  };

  const getVenueOptions = () => {
    const result: JSX.Element[] = [];
    currentLesson?.venues.forEach((v: any) => result.push(<MenuItem value={v.id}>{v.name}</MenuItem>));
    return result;
  };

  const getHeaderActions = () => {
    const actions = [];

    // Preview/Print button
    const currentVenue = ArrayHelper.getOne(currentLesson?.venues || [], "id", schedule.venueId);
    if (currentVenue) {
      actions.push(<Button
        key="preview"
        size="small"
        startIcon={<OpenInNewIcon />}
        endIcon={<PrintIcon />}
        onClick={e => {
          e.preventDefault();
          window.open("/tools/olf?feedUrl=" + encodeURIComponent(currentVenue.apiUrl), "_blank");
        }}
        variant="outlined"
        sx={{
          color: "var(--c1d2)",
          borderColor: "var(--c1d2)"
        }}>
          Preview / Print
      </Button>);
    }

    // Action buttons
    actions.push(<Button
      key="save"
      size="small"
      startIcon={<SaveIcon />}
      onClick={handleSave}
      variant="contained"
      sx={{
        backgroundColor: "var(--c1)",
        "&:hover": { backgroundColor: "var(--c1d1)" }
      }}>
        Save
    </Button>);

    actions.push(<Button
      key="cancel"
      size="small"
      startIcon={<CancelIcon />}
      onClick={handleCancel}
      variant="outlined"
      sx={{
        color: "var(--c1d2)",
        borderColor: "var(--c1d2)"
      }}>
        Cancel
    </Button>);

    if (schedule.id) {
      actions.push(<IconButton
        key="delete"
        size="small"
        onClick={handleDelete}
        sx={{
          color: "#d32f2f",
          "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" }
        }}
        title="Delete schedule">
        <DeleteIcon fontSize="small" />
      </IconButton>);
    }

    return actions;
  };

  const loadData = async () => {
    await loadInternal();
    const external = await loadExternalProviders();
    if (schedule.externalProviderId) {
      await loadExternalProviderData(external, schedule.externalProviderId);
      const s = { ...props.schedule };
      setSchedule(s);
    }
  };

  useEffect(() => {
    loadData();
  }, [props.schedule]);

  if (!schedule) return <></>;

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
          <CalendarIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography
            variant="h6"
            sx={{
              color: "var(--c1d2)",
              fontWeight: 600,
              lineHeight: 1,
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center"
            }}>
            Edit Schedule
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        <ErrorMessages errors={errors} />
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Schedule Date"
            type="date"
            name="scheduledDate"
            value={DateHelper.formatHtml5Date(schedule?.scheduledDate)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          {externalProviders?.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select
                label="Provider"
                name="externalProvider"
                value={schedule.externalProviderId || "lessons.church"}
                onChange={handleProviderChange}>
                {getProviderOptions()}
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth>
            <InputLabel>Program</InputLabel>
            <Select label="Program" name="program" value={schedule.programId || ""} onChange={handleChange}>
              {getProgramOptions()}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Study</InputLabel>
            <Select label="Study" name="study" value={schedule.studyId || ""} onChange={handleChange}>
              {getStudyOptions()}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="lessonLabel">Lesson</InputLabel>
            <Select
              labelId="lessonLabel"
              label="Lesson"
              name="lesson"
              value={schedule.lessonId || ""}
              onChange={handleChange}>
              {getLessonOptions()}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="venueLabel">Venue</InputLabel>
            <Select
              labelId="venueLabel"
              label="Venue"
              name="venue"
              id="venue"
              value={schedule.venueId || ""}
              onChange={handleChange}>
              {getVenueOptions()}
            </Select>
          </FormControl>
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
        {getHeaderActions()}
      </Box>
    </Paper>
  );
}
