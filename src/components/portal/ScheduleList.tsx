import Link from "next/link";
import { useEffect, useState } from "react";
import { Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Edit as EditIcon,
  Psychology as PsychologyIcon,
  VideoLibrary as VideoIcon } from "@mui/icons-material";
import { Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography } from "@mui/material";
import { ArrayHelper, DateHelper, Loading } from "@churchapps/apphelper";
import { ApiHelper, ScheduleInterface } from "@/helpers";
import { ScheduleEdit } from "../index";

interface Props {
  classroomId: string;
}

export function ScheduleList(props: Props) {
  const [schedules, setSchedules] = useState<ScheduleInterface[]>(null);
  const [editSchedule, setEditSchedule] = useState<ScheduleInterface>(null);

  const loadData = () => {
    ApiHelper.get("/schedules/classroom/" + props.classroomId, "LessonsApi").then((data: any) => {
      ArrayHelper.sortBy(data, "scheduledDate", true);
      setSchedules(data);
    });
  };

  const getRows = () => {
    return schedules.map(s => {
      const scheduleDate = new Date(s.scheduledDate);
      const isUpcoming = scheduleDate > new Date();
      const isPast = scheduleDate < new Date();

      return (
        <TableRow
          key={s.id}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)"
            }
          }}>
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarIcon sx={{ color: "var(--c1)", fontSize: "1.2rem" }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {DateHelper.formatHtml5Date(s?.scheduledDate)}
                </Typography>
                <Chip
                  label={isUpcoming ? "Upcoming" : isPast ? "Past" : "Today"}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.7rem",
                    backgroundColor: isUpcoming ? "#e3f2fd" : isPast ? "#f5f5f5" : "#e8f5e9",
                    color: isUpcoming ? "#1565c0" : isPast ? "#757575" : "#2e7d32"
                  }}
                />
              </Box>
            </Stack>
          </TableCell>
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={1}>
              <VideoIcon sx={{ color: "var(--c1)", fontSize: "1.2rem" }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {s.displayName}
                </Typography>
                {s.venueId && !s.externalProviderId && (
                  <Link href={`/portal/venue/${s.venueId}?classroomId=${props.classroomId}`}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--c1)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        "&:hover": { textDecoration: "underline" }
                      }}>
                      <PsychologyIcon fontSize="inherit" />
                      Customize
                    </Typography>
                  </Link>
                )}
                {s.externalProviderId && s.lessonId && (
                  <Link href={`/external/${s.externalProviderId}/${s.programId}/${s.studyId}/${s.lessonId}`}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--c1)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        "&:hover": { textDecoration: "underline" }
                      }}>
                      <VideoIcon fontSize="inherit" />
                      View Lesson
                    </Typography>
                  </Link>
                )}
              </Box>
            </Stack>
          </TableCell>
          <TableCell align="right">
            <IconButton
              size="small"
              onClick={() => setEditSchedule(s)}
              sx={{
                color: "var(--c1)",
                "&:hover": { backgroundColor: "var(--c1l7)" }
              }}
              title="Edit schedule">
              <EditIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  const getTable = () => {
    if (schedules === null) return <Loading />;

    if (schedules.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CalendarIcon sx={{ fontSize: 48, color: "var(--c1l2)", mb: 2 }} />
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No schedules found for this classroom
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditSchedule(getNewSchedule())}>
            Add First Schedule
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

  const getNewSchedule = (): ScheduleInterface => {
    const newSchedule: ScheduleInterface = {
      classroomId: props.classroomId,
      scheduledDate: new Date(),
      lessonId: "default",
      venueId: ""
    };

    if (schedules?.length > 0) {
      const lastSchedule = schedules[0];
      newSchedule.lessonId = "next";
      newSchedule.programId = lastSchedule.programId;
      newSchedule.studyId = lastSchedule.studyId;
      newSchedule.venueId = lastSchedule.venueId;
      newSchedule.scheduledDate = DateHelper.addDays(new Date(lastSchedule.scheduledDate), 7);
    }

    return newSchedule;
  };

  useEffect(loadData, [props.classroomId]);

  if (editSchedule) {
    return (
      <ScheduleEdit
        schedule={editSchedule}
        schedules={schedules}
        updatedCallback={() => {
          setEditSchedule(null);
          loadData();
        }}
      />
    );
  }

  if (!props.classroomId) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <VideoIcon sx={{ fontSize: 64, color: "var(--c1l2)", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Welcome to Classroom Management
        </Typography>
        <Typography color="text.secondary">Select a classroom to view and manage lesson schedules</Typography>
      </Box>
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
            Lesson Schedule
          </Typography>
        </Stack>

        {schedules && schedules.length > 0 && (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setEditSchedule(getNewSchedule())}
            sx={{ color: "var(--c1d2)" }}>
            Add Schedule
          </Button>
        )}
      </Box>

      <Box sx={{ p: 2 }}>{getTable()}</Box>
    </Paper>
  );
}
