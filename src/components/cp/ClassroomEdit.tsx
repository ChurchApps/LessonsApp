import { useState, useEffect } from "react";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, ClassroomInterface } from "@/utils";
import { TextField } from "@mui/material";

type Props = {
  classroom: ClassroomInterface;
  updatedCallback: (classroom: ClassroomInterface) => void;
};

export function ClassroomEdit(props: Props) {
  const [classroom, setClassroom] = useState<ClassroomInterface>({} as ClassroomInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(classroom);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let v = { ...classroom };
    switch (e.currentTarget.name) {
      case "name": v.name = e.currentTarget.value; break;
    }
    setClassroom(v);
  };

  const validate = () => {
    let errors = [];
    if (classroom.name === "") errors.push("Please enter a classroom name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/classrooms", [classroom], "LessonsApi").then((data) => {
        setClassroom(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this classroom?")) {
      ApiHelper.delete("/classrooms/" + classroom.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  };

  useEffect(() => { setClassroom(props.classroom); }, [props.classroom]);

  return (
    <InputBox id="classroomDetailsBox" headerText="Edit Classroom" headerIcon="fas fa-graduation-cap" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete} >
      <ErrorMessages errors={errors} />
      <TextField fullWidth label="Classroom Name" name="name" value={classroom.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="3rd-5th Grade" />
    </InputBox>
  );
}
