import { useEffect, useState } from "react";
import {
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  School as SchoolIcon
} from "@mui/icons-material";
import {
  Box,
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
  Typography
} from "@mui/material";
import { ErrorMessages } from "@churchapps/apphelper";
import { GroupInterface } from "@churchapps/helpers";
import { ApiHelper, ClassroomInterface } from "@/helpers";

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
    const c = { ...classroom };
    switch (e.target.name) {
      case "name": c.name = e.target.value; break;
      case "upcomingGroupId": c.upcomingGroupId = e.target.value; break;
      case "recentGroupId": c.recentGroupId = e.target.value; break;
    }
    setClassroom(c);
  };

  const validate = () => {
    const errors = [];
    if (classroom.name === "") errors.push("Please enter a classroom name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/classrooms", [classroom], "LessonsApi").then(data => {
        setClassroom(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this classroom?")) ApiHelper.delete("/classrooms/" + classroom.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  const loadData = () => {
    ApiHelper.get("/groups/tag/standard", "MembershipApi").then(data => {
      setGroups(data);
    });
    ApiHelper.get("/groups/tag/team", "MembershipApi").then(data => {
      setTeams(data);
    });
  };

  useEffect(() => {
    setClassroom(props.classroom);
    loadData();
  }, [props.classroom]);

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
          <SchoolIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
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
            Edit Classroom
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        <ErrorMessages errors={errors} />
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Classroom Name"
            name="name"
            value={classroom.name || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="3rd-5th Grade"
          />

          <FormControl fullWidth>
            <InputLabel>Volunteer Team (optional)</InputLabel>
            <Select
              label="Volunteer Team (optional)"
              name="upcomingGroupId"
              value={classroom.upcomingGroupId || ""}
              onChange={handleChange}>
              <MenuItem value="">None</MenuItem>
              {teams.map(team => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>
              You can select a volunteer team to have access to upcoming lessons in the B1 app.
            </Typography>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Parent/Student Group (optional)</InputLabel>
            <Select
              label="Parent/Student Group (optional)"
              name="recentGroupId"
              value={classroom.recentGroupId || ""}
              onChange={handleChange}>
              <MenuItem value="">None</MenuItem>
              {groups.map(group => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>
              You can select a group of students and/or parents to have access to recent lessons in the B1 app.
            </Typography>
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
          gap: 1
        }}>
        <Button
          size="small"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: "var(--c1)",
            "&:hover": { backgroundColor: "var(--c1d1)" }
          }}>
          Save
        </Button>
        <Button
          size="small"
          startIcon={<CancelIcon />}
          onClick={handleCancel}
          variant="outlined"
          sx={{
            color: "var(--c1d2)",
            borderColor: "var(--c1d2)"
          }}>
          Cancel
        </Button>
        {classroom.id && (
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              color: "#d32f2f",
              "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" }
            }}
            title="Delete classroom">
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
