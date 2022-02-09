import { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, LessonInterface, ProgramInterface, ScheduleInterface, StudyInterface, VenueInterface } from "@/utils";
import { ArrayHelper, DateHelper } from "@/appBase/helpers";

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

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setProgramId(e.target.value);
  };

  const handleStudyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setStudyId(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let s = { ...schedule };
    switch (e.currentTarget.name) {
      case "scheduledDate":
        s.scheduledDate = new Date(e.currentTarget.value);
        break;
      case "lesson":
        s.lessonId = e.currentTarget.value;
        break;
      case "venue":
        s.venueId = e.currentTarget.value;
        break;
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
    //const programName = ArrayHelper.getOne(programs, "id", programId).name;
    const studyName = ArrayHelper.getOne(studies, "id", studyId).name;
    const lessonName = ArrayHelper.getOne(lessons, "id", schedule.lessonId).name;
    //return programName + ": " + studyName + " - " + lessonName;
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
    programs.forEach(p => result.push(<option value={p.id}>{p.name}</option>));
    return result;
  }

  const getStudyOptions = () => {
    const result: JSX.Element[] = [];
    studies.forEach(s => result.push(<option value={s.id}>{s.name}</option>));
    return result;
  }

  const getLessonOptions = () => {
    const result: JSX.Element[] = [];
    lessons.forEach(l => result.push(<option value={l.id}>{l.name}</option>));
    return result;
  }

  const getVenueOptions = () => {
    const result: JSX.Element[] = [];
    venues.forEach(v => result.push(<option value={v.id}>{v.name}</option>));
    return result;
  }

  const populateSchedule = async (schedule: ScheduleInterface) => {
    if (schedule.id) {
      const lesson = await ApiHelper.getAnonymous("/lessons/public/" + schedule.lessonId, "LessonsApi");
      const study = await ApiHelper.getAnonymous("/studies/public/" + lesson.studyId, "LessonsApi");
      setProgramId(study.programId);
      setStudyId(study.id);
    }
  }

  useEffect(() => { if (props.schedule) loadPrograms(); }, [props.schedule?.id]);
  useEffect(() => { loadStudies(); }, [programId]);
  useEffect(() => { loadLessons(); }, [studyId]);
  useEffect(() => { loadVenues(); }, [schedule?.lessonId]);
  useEffect(() => { setSchedule(props.schedule); populateSchedule(props.schedule) }, [props.schedule]);

  return (
    <>
      <InputBox id="scheduleDetailsBox" headerText="Edit Schedule" headerIcon="fas fa-graduation-cap" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete} >
        <ErrorMessages errors={errors} />
        <FormGroup>
          <FormLabel>Schedule Date</FormLabel>
          <FormControl type="date" name="scheduledDate" value={DateHelper.formatHtml5Date(schedule?.scheduledDate)} onChange={handleChange} onKeyDown={handleKeyDown} />
        </FormGroup>
        <FormGroup>
          <FormLabel>Program</FormLabel>
          <FormControl as="select" name="provider" value={programId} onChange={handleProgramChange}>
            {getProgramOptions()}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Study</FormLabel>
          <FormControl as="select" name="study" value={studyId} onChange={handleStudyChange}>
            {getStudyOptions()}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Lesson</FormLabel>
          <FormControl as="select" name="lesson" value={schedule?.lessonId} onChange={handleChange}>
            {getLessonOptions()}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Venue</FormLabel>
          <FormControl as="select" name="venue" id="venue" value={schedule?.venueId} onChange={handleChange}>
            {getVenueOptions()}
          </FormControl>
        </FormGroup>

      </InputBox>
    </>
  );
}
