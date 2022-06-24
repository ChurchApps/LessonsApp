import { useState, useEffect } from "react";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, LessonInterface, ProgramInterface, ScheduleInterface, StudyInterface, VenueInterface } from "@/utils";
import { ArrayHelper, DateHelper } from "@/appBase/helpers";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

type Props = {
  schedule: ScheduleInterface;
  updatedCallback: (schedule: ScheduleInterface) => void;
};

export function ScheduleEdit(props: Props) {
  const [schedule, setSchedule] = useState<ScheduleInterface>({} as ScheduleInterface);
  const [errors, setErrors] = useState([]);
  const [programId, setProgramId] = useState("");
  const [programs, setPrograms] = useState<ProgramInterface[]>([]);
  const [studyId, setStudyId] = useState("");
  const [studies, setStudies] = useState<StudyInterface[]>([]);
  const [lessons, setLessons] = useState<LessonInterface[]>([]);
  const [venues, setVenues] = useState<VenueInterface[]>([]);
  const [readyToLoad, setReadyToLoad] = useState(false);


  //TODO: load existing data on edit
  const loadPrograms = () => {
    ApiHelper.getAnonymous("/programs/public/", "LessonsApi").then((data: any) => {
      setPrograms(data);
      if (!programId || !ArrayHelper.getOne(data, "id", programId)) setProgramId(data[0].id);
    });
  };

  const loadStudies = () => {
    if (programId) ApiHelper.getAnonymous("/studies/public/program/" + programId, "LessonsApi").then((data: any) => {
      setStudies(data);
      if (!studyId || !ArrayHelper.getOne(data, "id", studyId)) setStudyId(data[0].id)
    });
  }

  const loadLessons = () => {
    if (programId) ApiHelper.getAnonymous("/lessons/public/study/" + studyId, "LessonsApi").then((data: any) => {
      setLessons(data);
      if (schedule) {
        if (!schedule.lessonId || !ArrayHelper.getOne(data, "id", schedule.lessonId)) {
          let s = { ...schedule };
          s.lessonId = data[0].id;
          setSchedule(s);
        }
      }
    });
  }

  const loadVenues = () => {
    if (schedule?.lessonId) ApiHelper.getAnonymous("/venues/public/lesson/" + schedule.lessonId, "LessonsApi").then((data: any) => {
      setVenues(data);
      if (schedule) {
        if (!schedule.venueId || !ArrayHelper.getOne(data, "id", schedule.venueId)) {
          let s = { ...schedule };
          s.venueId = data[0].id;
          setSchedule(s);
        }
      }
    });
  }

  const handleCancel = () => props.updatedCallback(schedule);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleProgramChange = (e: SelectChangeEvent<string>) => {
    console.log("HANDLE PROGRAM CHANGE")
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
    const studyName = ArrayHelper.getOne(studies, "id", studyId).name;
    const lessonName = ArrayHelper.getOne(lessons, "id", schedule.lessonId).name;
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

  const getProgramOptions = () => {
    const result: JSX.Element[] = [];
    programs.forEach(p => result.push(<MenuItem value={p.id}>{p.name}</MenuItem>));
    return result;
  }

  const getStudyOptions = () => {
    const result: JSX.Element[] = [];
    studies.forEach(s => result.push(<MenuItem value={s.id}>{s.name}</MenuItem>));
    return result;
  }

  const getLessonOptions = () => {
    const result: JSX.Element[] = [];
    lessons.forEach(l => result.push(<MenuItem value={l.id}>{l.name}</MenuItem>));
    return result;
  }

  const getVenueOptions = () => {
    const result: JSX.Element[] = [];
    venues.forEach(v => result.push(<MenuItem value={v.id}>{v.name}</MenuItem>));
    return result;
  }

  const populateSchedule = async (s: ScheduleInterface) => {
    setSchedule(props.schedule);
    if (s.id) {
      const l = await ApiHelper.getAnonymous("/lessons/public/" + s.lessonId, "LessonsApi");
      const st = await ApiHelper.getAnonymous("/studies/public/" + l.studyId, "LessonsApi");
      setProgramId(st.programId);
      setStudyId(st.id);
    }
    setReadyToLoad(true);
  }

  const init = () => {
    populateSchedule(props.schedule);
  }

  useEffect(() => { if (readyToLoad) loadStudies(); }, [programId, readyToLoad]);
  useEffect(() => { if (readyToLoad) loadLessons(); }, [studyId, readyToLoad]);
  useEffect(() => { if (readyToLoad) loadVenues(); }, [schedule?.lessonId, readyToLoad]);
  useEffect(init, [props.schedule]);
  useEffect(() => { if (readyToLoad) loadPrograms() }, [readyToLoad]);

  return (
    <>
      <InputBox id="scheduleDetailsBox" headerText="Edit Schedule" headerIcon="fas fa-graduation-cap" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete} >
        <ErrorMessages errors={errors} />
        <TextField fullWidth label="Schedule Date" type="date" name="scheduledDate" value={DateHelper.formatHtml5Date(schedule?.scheduledDate)} onChange={handleChange} onKeyDown={handleKeyDown} />
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
          <InputLabel>Lesson</InputLabel>
          <Select label="Lesson" name="lesson" value={schedule?.lessonId} onChange={handleChange}>
            {getLessonOptions()}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Venue</InputLabel>
          <Select label="Venue" name="venue" id="venue" value={schedule?.venueId} onChange={handleChange}>
            {getVenueOptions()}
          </Select>
        </FormControl>
      </InputBox>
    </>
  );
}
