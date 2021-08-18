import { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, ScheduleInterface } from "@/utils";

type Props = {
  schedule: ScheduleInterface;
  updatedCallback: (schedule: ScheduleInterface) => void;
};

export function ScheduleEdit(props: Props) {
  const [schedule, setSchedule] = useState<ScheduleInterface>({} as ScheduleInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(schedule);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let s = { ...schedule };
    switch (e.currentTarget.name) {
      case "scheduledDate":
        s.scheduledDate = new Date(e.currentTarget.value);
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

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/schedules", [schedule], "LessonsApi").then((data) => {
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

  useEffect(() => { setSchedule(props.schedule); }, [props.schedule]);

  return (
    <>
      <InputBox id="scheduleDetailsBox" headerText="Edit Schedule" headerIcon="fas fa-graduation-cap" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete} >
        <ErrorMessages errors={errors} />
        <FormGroup>
          <FormLabel>Schedule Name</FormLabel>
          <FormControl type="date" name="scheduledDate" value={schedule.scheduledDate.toDateString()} onChange={handleChange} onKeyDown={handleKeyDown} />
        </FormGroup>
      </InputBox>
    </>
  );
}
