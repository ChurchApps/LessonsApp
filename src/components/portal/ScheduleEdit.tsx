import { useState, useEffect } from "react";
import { InputBox, ErrorMessages, ArrayHelper, DateHelper } from "@churchapps/apphelper";
import { ApiHelper, ExternalProviderInterface, ScheduleInterface } from "@/utils";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

type Props = {
  schedule: ScheduleInterface;
  schedules: ScheduleInterface[];
  updatedCallback: (schedule: ScheduleInterface) => void;
};

export function ScheduleEdit(props: Props) {
  const [schedule, setSchedule] = useState<ScheduleInterface>(props.schedule);
  const [errors, setErrors] = useState([]);

  const [externalProviderId, setExternalProviderId] = useState("lessons.church");
  const [externalProviders, setExternalProviders] = useState<ExternalProviderInterface[]>([]);

  const [lessonTree, setLessonTree] = useState<any>({})

  const [programId, setProgramId] = useState("");
  const [studyId, setStudyId] = useState("");
  const [readyToLoad, setReadyToLoad] = useState(false);

  const setDefault = (array:any[], id:string, setter:(id:string) => void) => {
    if (array && (!id || !ArrayHelper.getOne(array, "id", id))) setter(array[0].id);
  }

  const getDefault = (array:any[], id:string) => {
    let result = id;
    if (array && (!id || !ArrayHelper.getOne(array, "id", id))) result = array[0].id;
    return result;
  }

  if (lessonTree) setDefault(lessonTree.programs, programId, setProgramId);
  const currentProgram = ArrayHelper.getOne(lessonTree?.programs || [], "id", programId);

  if (currentProgram) setDefault(currentProgram.studies, studyId, setStudyId);
  const currentStudy = ArrayHelper.getOne(currentProgram?.studies || [], "id", studyId);



  const s = {...schedule};
  if (currentStudy) s.lessonId = getDefault(currentStudy.lessons, s.lessonId);
  const currentLesson = ArrayHelper.getOne(currentStudy?.lessons || [], "id", s.lessonId);

  if (currentLesson) s.venueId = getDefault(currentLesson.venues, s.venueId);
  const currentVenue = ArrayHelper.getOne(currentLesson?.venues || [], "id", s.venueId);

  if (s.venueId!==schedule.venueId) setSchedule(s);

  console.log("currentProgram", currentProgram?.name, "currentStudy", currentStudy?.name, "currentLesson", currentLesson?.name, "currentVenue", currentVenue?.name);

  const loadExternalProviders = () => {
    ApiHelper.get("/externalProviders", "LessonsApi").then((data: any) => {
      setExternalProviders(data);
    });
  };

  const loadInternal = () => {
    ApiHelper.getAnonymous("/lessons/public/tree", "LessonsApi").then((data: any) => {
      setLessonTree(data);
    });
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
    setExternalProviderId(e.target.value);
  };

  const handleProgramChange = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setProgramId(e.target.value);
  };

  const handleStudyChange = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setStudyId(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let s = { ...schedule };
    switch (e.target.name) {
      case "scheduledDate": s.scheduledDate = new Date(e.target.value); break;
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
  }

  const handleSave = () => {
    if (validate()) {
      const s = { ...schedule };
      s.displayName = getDisplayName();

      ApiHelper.post("/schedules", [s], "LessonsApi").then((data) => {
        setSchedule(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this schedule?")) {
      ApiHelper.delete("/schedules/" + schedule.id.toString(), "LessonsApi").then(
        () => props.updatedCallback(null)
      );
    }
  };

  const getProviderOptions = () => {
    const result: JSX.Element[] = [];
    result.push(<MenuItem value="lessons.church">Lessons.church</MenuItem>);
    externalProviders.forEach(p => result.push(<MenuItem value={p.id}>{p.name}</MenuItem>));
    return result;
  }

  const getProgramOptions = () => {
    const result: JSX.Element[] = [];
    lessonTree?.programs?.forEach((p:any) => result.push(<MenuItem value={p.id}>{p.name}</MenuItem>));
    return result;
  }

  const getStudyOptions = () => {
    const result: JSX.Element[] = [];
    currentProgram?.studies?.forEach((s:any) => result.push(<MenuItem value={s.id}>{s.name}</MenuItem>));
    return result;
  }

  const getLessonOptions = () => {
    const result: JSX.Element[] = [];
    currentStudy?.lessons?.forEach((l:any) => {
      let sx: any = {};
      const existing:ScheduleInterface = ArrayHelper.getOne(props.schedules, "lessonId", l.id)
      if (existing && existing?.scheduledDate !== schedule.scheduledDate) sx.color = "#999";
      result.push(<MenuItem value={l.id} sx={sx}>{l.name}</MenuItem>)
    });
    return result;
  }

  const getVenueOptions = () => {
    const result: JSX.Element[] = [];
    currentLesson?.venues.forEach((v:any) => result.push(<MenuItem value={v.id}>{v.name}</MenuItem>));
    return result;
  }

  const populateSchedule = async (s: ScheduleInterface) => {
    setSchedule(props.schedule);
    if (s.lessonId) {
      const l = await ApiHelper.getAnonymous("/lessons/public/" + s.lessonId, "LessonsApi");
      //const st = await ApiHelper.getAnonymous("/studies/public/" + l.studyId, "LessonsApi");
      const st = l.study;
      setProgramId(st.programId);
      setStudyId(st.id);
    }
    setReadyToLoad(true);
  }

  const init = () => {
    populateSchedule(props.schedule);
  }

  //useEffect(() => { if (readyToLoad) loadStudies(); }, [programId, readyToLoad]);
  //useEffect(() => { if (readyToLoad) loadLessons(); }, [studyId, readyToLoad]);
  //useEffect(() => { if (readyToLoad) loadVenues(); }, [schedule?.lessonId, readyToLoad]);
  useEffect(init, [props.schedule]);
  useEffect(() => {
    if (readyToLoad) {
      loadInternal();
      loadExternalProviders();
    }
  }, [readyToLoad]);

  if (!schedule) return <></>
  else {
    return (
      <>
        <InputBox id="scheduleDetailsBox" headerText="Edit Schedule" headerIcon="school" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
          <ErrorMessages errors={errors} />
          <TextField fullWidth label="Schedule Date" type="date" name="scheduledDate" value={DateHelper.formatHtml5Date(schedule?.scheduledDate)} onChange={handleChange} onKeyDown={handleKeyDown} />

          <FormControl fullWidth>
            <InputLabel>Provider</InputLabel>
            <Select label="Provider" name="provider" value={externalProviderId} onChange={handleProviderChange}>
              {getProviderOptions()}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Program</InputLabel>
            <Select label="Program" name="program" value={programId} onChange={handleProgramChange}>
              {getProgramOptions()}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Study</InputLabel>
            <Select label="Study" name="study" value={studyId} onChange={handleStudyChange}>
              {getStudyOptions()}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="lessonLabel">Lesson</InputLabel>
            <Select labelId="lessonLabel" label="Lesson" name="lesson" value={schedule.lessonId} onChange={handleChange}>
              {getLessonOptions()}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="venueLabel">Venue</InputLabel>
            <Select labelId="venueLabel" label="Venue" name="venue" id="venue" value={schedule.venueId} onChange={handleChange}>
              {getVenueOptions()}
            </Select>
          </FormControl>
        </InputBox>
      </>
    );
  }
}
