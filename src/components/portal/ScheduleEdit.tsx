import { useEffect, useState } from "react";
import { CalendarMonth as CalendarIcon, Cancel as CancelIcon, Delete as DeleteIcon, OpenInNew as OpenInNewIcon, Print as PrintIcon, Save as SaveIcon } from "@mui/icons-material";
import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { ArrayHelper, DateHelper } from "@churchapps/apphelper";
import { useForm } from "react-hook-form";
import { ApiHelper, ExternalProviderInterface, LessonTreeInterface, ScheduleInterface } from "@/helpers";

interface Props {
  schedule: ScheduleInterface;
  schedules: ScheduleInterface[];
  updatedCallback: (schedule: ScheduleInterface) => void;
}

type AnyRecord = Record<string, any>;

export function ScheduleEdit(props: Props) {
  const [externalProviders, setExternalProviders] = useState<ExternalProviderInterface[]>([]);
  const [lessonTree, setLessonTree] = useState<LessonTreeInterface>({});

  const { register, handleSubmit, reset, watch, setValue, formState } = useForm<AnyRecord>({ defaultValues: { scheduledDate: "", externalProviderId: "", programId: "", studyId: "", lessonId: "", venueId: "" } });
  const e = formState.errors as any;
  const rawProgramId = watch("programId");
  const rawStudyId = watch("studyId");
  const rawLessonId = watch("lessonId");
  const rawVenueId = watch("venueId");
  const externalProviderId = watch("externalProviderId");
  const summaryErrors: string[] = [];
  if (e.scheduledDate?.message) summaryErrors.push(e.scheduledDate.message);

  const getDefault = (array: Array<{ id: string }>, id: string) => {
    if (array && array.length > 0 && (!id || !ArrayHelper.getOne(array, "id", id))) return array[0].id;
    return id;
  };

  const getLessonId = (array: Array<{ id: string }>, id: string) => {
    if (id === "default") return getDefault(array, id);
    if (id === "next") {
      const index = ArrayHelper.getIndex(array, "id", props.schedules[0]?.lessonId);
      const newIndex = index + 1;
      if (newIndex < array.length) return array[newIndex].id;
      return array[0]?.id || "";
    }
    return id;
  };

  // Resolve cascading IDs synchronously during render so Selects always have a valid value.
  const resolvedProgramId = lessonTree?.programs ? getDefault(lessonTree.programs, rawProgramId) : rawProgramId;
  const currentProgram = ArrayHelper.getOne(lessonTree?.programs || [], "id", resolvedProgramId);
  const resolvedStudyId = currentProgram?.studies ? getDefault(currentProgram.studies, rawStudyId) : rawStudyId;
  const currentStudy = ArrayHelper.getOne(currentProgram?.studies || [], "id", resolvedStudyId);
  const resolvedLessonId = currentStudy?.lessons ? getLessonId(currentStudy.lessons, rawLessonId) : rawLessonId;
  const currentLesson = ArrayHelper.getOne(currentStudy?.lessons || [], "id", resolvedLessonId);
  const resolvedVenueId = currentLesson?.venues ? getDefault(currentLesson.venues, rawVenueId) : rawVenueId;

  // Sync form state with resolved values after render so save reads the right ones.
  useEffect(() => {
    if (resolvedProgramId !== rawProgramId) setValue("programId", resolvedProgramId);
    if (resolvedStudyId !== rawStudyId) setValue("studyId", resolvedStudyId);
    if (resolvedLessonId !== rawLessonId) setValue("lessonId", resolvedLessonId);
    if (resolvedVenueId !== rawVenueId) setValue("venueId", resolvedVenueId);
  }, [resolvedProgramId, resolvedStudyId, resolvedLessonId, resolvedVenueId, rawProgramId, rawStudyId, rawLessonId, rawVenueId, setValue]);

  const loadExternalProviderData = async (providers: ExternalProviderInterface[], id: string) => {
    const ep: ExternalProviderInterface = ArrayHelper.getOne(providers, "id", id);
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

  const handleCancel = () => props.updatedCallback(props.schedule);

  const handleProviderChange = (val: string) => {
    const id = val.replace("lessons.church", "");
    setValue("externalProviderId", id);
    if (id === "") loadInternal();
    else loadExternalProviderData(externalProviders, val);
  };

  const onValid = (values: AnyRecord) => {
    const studyName = currentStudy?.name;
    const lessonName = currentLesson?.name;
    const s: ScheduleInterface = {
      ...props.schedule,
      scheduledDate: values.scheduledDate ? new Date(values.scheduledDate) : null,
      externalProviderId: values.externalProviderId || null,
      programId: values.programId,
      studyId: values.studyId,
      lessonId: values.lessonId,
      venueId: values.venueId,
      displayName: studyName + " - " + lessonName
    };
    ApiHelper.post("/schedules", [s], "LessonsApi").then((data: ScheduleInterface[]) => props.updatedCallback(data[0]));
  };

  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this schedule?")) ApiHelper.delete("/schedules/" + props.schedule.id.toString(), "LessonsApi").then(() => props.updatedCallback(null)); };

  const loadData = async () => {
    await loadInternal();
    const external = await loadExternalProviders();
    if (props.schedule?.externalProviderId) await loadExternalProviderData(external, props.schedule.externalProviderId);
  };

  useEffect(() => {
    if (props.schedule) {
      reset({
        scheduledDate: DateHelper.formatHtml5Date(props.schedule.scheduledDate as Date),
        externalProviderId: props.schedule.externalProviderId || "",
        programId: props.schedule.programId || "",
        studyId: props.schedule.studyId || "",
        lessonId: props.schedule.lessonId || "",
        venueId: props.schedule.venueId || ""
      });
      loadData();
    }
  }, [props.schedule, reset]);

  if (!props.schedule) return <></>;

  return (
    <Paper sx={{ borderRadius: 2, border: "1px solid var(--admin-border)", boxShadow: "var(--admin-shadow-sm)", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid var(--admin-border)", backgroundColor: "var(--c1l7)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CalendarIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
          <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600, lineHeight: 1, fontSize: "1.25rem", display: "flex", alignItems: "center" }}>Edit Schedule</Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}
        <Stack spacing={3}>
          <TextField fullWidth label="Schedule Date" type="date" error={!!e.scheduledDate} helperText={e.scheduledDate?.message} {...register("scheduledDate", { required: "Please enter a schedule date." })} />

          {externalProviders?.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select label="Provider" name="externalProvider" value={externalProviderId || "lessons.church"} onChange={(ev) => handleProviderChange(ev.target.value as string)}>
                <MenuItem value="lessons.church">Lessons.church</MenuItem>
                {externalProviders.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth>
            <InputLabel>Program</InputLabel>
            <Select label="Program" name="program" value={resolvedProgramId || ""} onChange={(ev) => setValue("programId", ev.target.value as string)}>
              {lessonTree?.programs?.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Study</InputLabel>
            <Select label="Study" name="study" value={resolvedStudyId || ""} onChange={(ev) => setValue("studyId", ev.target.value as string)}>
              {currentProgram?.studies?.map((s: any) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="lessonLabel">Lesson</InputLabel>
            <Select labelId="lessonLabel" label="Lesson" name="lesson" value={resolvedLessonId || ""} onChange={(ev) => setValue("lessonId", ev.target.value as string)}>
              {currentStudy?.lessons?.map((l: any) => {
                const sx: any = {};
                const existing: ScheduleInterface = ArrayHelper.getOne(props.schedules, "lessonId", l.id);
                if (existing && existing.scheduledDate !== props.schedule.scheduledDate) sx.color = "#999";
                return <MenuItem key={l.id} value={l.id} sx={sx}>{l.name}</MenuItem>;
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="venueLabel">Venue</InputLabel>
            <Select labelId="venueLabel" label="Venue" name="venue" id="venue" value={resolvedVenueId || ""} onChange={(ev) => setValue("venueId", ev.target.value as string)}>
              {currentLesson?.venues?.map((v: any) => <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
        {(() => {
          const currentVenue = ArrayHelper.getOne(currentLesson?.venues || [], "id", resolvedVenueId);
          if (currentVenue) {
            return <Button key="preview" size="small" startIcon={<OpenInNewIcon />} endIcon={<PrintIcon />} onClick={(ev) => { ev.preventDefault(); window.open("/tools/olf?feedUrl=" + encodeURIComponent(currentVenue.apiUrl), "_blank"); }} variant="outlined" sx={{ color: "var(--c1d2)", borderColor: "var(--c1d2)" }}>Preview / Print</Button>;
          }
          return null;
        })()}
        <Button size="small" startIcon={<SaveIcon />} onClick={handleSubmit(onValid)} variant="contained" sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" } }}>Save</Button>
        <Button size="small" startIcon={<CancelIcon />} onClick={handleCancel} variant="outlined" sx={{ color: "var(--c1d2)", borderColor: "var(--c1d2)" }}>Cancel</Button>
        {props.schedule?.id && (
          <IconButton size="small" onClick={handleDelete} sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }} title="Delete schedule">
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
