import { useState, useEffect } from "react";
import { InputBox, ErrorMessages, GroupInterface } from "@churchapps/apphelper";
import { ApiHelper, ClassroomInterface } from "@/helpers";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

interface Props {
  classroom: ClassroomInterface;
  updatedCallback: (classroom: ClassroomInterface) => void;
}

export function ClassroomEdit(props: Props) {
  const [classroom, setClassroom] = useState<ClassroomInterface>({} as ClassroomInterface);
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [teams, setTeams] = useState<GroupInterface[]>([]);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(classroom);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let c = { ...classroom };
    switch (e.target.name) {
      case "name": c.name = e.target.value; break;
      case "upcomingGroupId": c.upcomingGroupId = e.target.value; break;
      case "recentGroupId": c.recentGroupId = e.target.value; break;
    }
    setClassroom(c);
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

  const loadData = () => {
    ApiHelper.get("/groups/tag/standard", "MembershipApi").then((data) => { setGroups(data); });
    ApiHelper.get("/groups/tag/team", "MembershipApi").then((data) => { setTeams(data); });
  }

  useEffect(() => { setClassroom(props.classroom); loadData() }, [props.classroom]);

  return (
    <InputBox id="classroomDetailsBox" headerText="Edit Classroom" headerIcon="school" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <TextField fullWidth label="Classroom Name" name="name" value={classroom.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="3rd-5th Grade" />
      <FormControl fullWidth>
        <InputLabel>Volunteer Team (optional)</InputLabel>
        <Select label="Volunteer Team (optional)" name="upcomingGroupId" value={classroom.upcomingGroupId || ""} onChange={handleChange}>
          <MenuItem value="">None</MenuItem>
          {teams.map((team) => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)}
        </Select>
        <p><i>You can select a <u>volunteer team</u> to have access to upcoming lessons in the B1 app.</i></p>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Parent/Student Group (optional)</InputLabel>
        <Select label="Parent/Student Group (optional)" name="recentGroupId" value={classroom.recentGroupId || ""} onChange={handleChange}>
          <MenuItem value="">None</MenuItem>
          {groups.map((group) => <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>)}
        </Select>
        <p><i>You can select a <u>group</u> of students and/or parents to have access to recent lessons in the B1 app.</i></p>
      </FormControl>
    </InputBox>
  );
}
