import { useEffect, useState } from "react";
import { Add as AddIcon, Edit as EditIcon, RssFeed as RssFeedIcon, School as SchoolIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import { Loading } from "@churchapps/apphelper";
import { ApiHelper, ClassroomInterface } from "@/helpers";
import { ClassroomEdit } from "../index";

interface Props {
  classroomSelected: (classroomId: string) => void;
  showFeed: (classroomId: string) => void;
}

export function ClassroomList(props: Props) {
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>(null);
  const [editClassroom, setEditClassroom] = useState<ClassroomInterface>(null);

  const loadData = () => {
    ApiHelper.get("/classrooms", "LessonsApi").then((data: any) => {
      setClassrooms(data);
    });
  };

  const getRows = () => {
    return classrooms.map(c => (
      <TableRow
        key={c.id}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)"
          }
        }}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SchoolIcon sx={{ color: "var(--c1)", fontSize: "1.2rem" }} />
            <Typography
              component="button"
              variant="body2"
              sx={{
                border: "none",
                background: "none",
                color: "var(--c1)",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline"
                }
              }}
              onClick={() => props.classroomSelected(c.id)}>
              {c.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <IconButton
              size="small"
              onClick={() => props.showFeed(c.id)}
              sx={{
                color: "var(--c1)",
                "&:hover": { backgroundColor: "var(--c1l7)" }
              }}
              title="Subscribe to feed">
              <RssFeedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setEditClassroom(c)}
              sx={{
                color: "var(--c1)",
                "&:hover": { backgroundColor: "var(--c1l7)" }
              }}
              title="Edit classroom">
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
    ));
  };

  const getTable = () => {
    if (classrooms === null) return <Loading />;

    if (classrooms.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No classrooms found
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditClassroom({})}>
            Add First Classroom
          </Button>
        </Box>
      );
    }

    return (
      <Table size="small">
        <TableBody>{getRows()}</TableBody>
      </Table>
    );
  };

  useEffect(loadData, []);

  if (editClassroom) {
    return (
      <ClassroomEdit
        classroom={editClassroom}
        updatedCallback={() => {
          setEditClassroom(null);
          loadData();
        }}
      />
    );
  }

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
            Classrooms
          </Typography>
        </Stack>

        {classrooms && classrooms.length > 0 && (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setEditClassroom({})}
            sx={{ color: "var(--c1d2)" }}>
            Add
          </Button>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select or add a classroom to manage schedules.
        </Typography>
        {getTable()}
      </Box>
    </Paper>
  );
}
