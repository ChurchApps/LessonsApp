"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { List as ListIcon, Storage as StorageIcon } from "@mui/icons-material";
import { SmallButton } from "@churchapps/apphelper";
import { OllLessonEdit } from "@/components/open-lesson/OllLessonEdit";
import { OllProgramEdit } from "@/components/open-lesson/OllProgramEdit";
import { OllStudyEdit } from "@/components/open-lesson/OllStudyEdit";
import { OllVenueEdit } from "@/components/open-lesson/OllVenueEdit";
import {
  FeedLessonInterface,
  FeedListInterface,
  FeedProgramInterface,
  FeedStudyInterface,
  FeedVenueLinkInterface
} from "@/helpers";

export default function OllInner() {
  const [data, setData] = useState<FeedListInterface>({} as FeedListInterface);
  const [editProgramIndex, setEditProgramIndex] = useState<number>(null);
  const [editStudyIndex, setEditStudyIndex] = useState<number>(null);
  const [editLessonIndex, setEditLessonIndex] = useState<number>(null);
  const [editVenueIndex, setEditVenueIndex] = useState<number>(null);

  const searchParams = useSearchParams();

  /*
  const handleMarkdownChange = (newValue: string) => {
    let d = { ...data };
    d.lessonDescription = newValue;
    setData(d);
  }
*/

  const handleDownload = () => {
    const content = JSON.stringify(data, null, 2);
    const link = document.createElement("a");
    const file = new Blob([content], { type: "application/json" });
    link.href = URL.createObjectURL(file);
    link.download = "lessons.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleUpload = () => {
    const f: any = document.getElementById("fileUpload");
    f.click();
  };

  const moveProgram = (index: number, direction: "up" | "down") => {
    const d = { ...data };
    if (direction === "up") {
      const item = d.programs.splice(index - 1, 1)[0];
      d.programs.splice(index, 0, item);
    } else {
      const item = d.programs.splice(index, 1)[0];
      d.programs.splice(index + 1, 0, item);
    }
    setData(d);
  };

  const handleFileChange = () => {
    const f = document.getElementById("fileUpload") as HTMLInputElement;
    if (!f || !f.files || !f.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      setData(null);
      setTimeout(() => {
        setData(JSON.parse(e.target.result));
      }, 50);
    };
    reader.readAsText(f.files[0]);
  };

  const moveStudy = (programIndex: number, index: number, direction: "up" | "down") => {
    const d = { ...data };
    const p = d.programs[programIndex];
    if (direction === "up") {
      const item = p.studies.splice(index - 1, 1)[0];
      p.studies.splice(index, 0, item);
    } else {
      const item = p.studies.splice(index, 1)[0];
      p.studies.splice(index + 1, 0, item);
    }
    setData(d);
  };

  const moveLesson = (programIndex: number, studyIndex: number, index: number, direction: "up" | "down") => {
    const d = { ...data };
    const s = d.programs[programIndex].studies[studyIndex];
    if (direction === "up") {
      const item = s.lessons.splice(index - 1, 1)[0];
      s.lessons.splice(index, 0, item);
    } else {
      const item = s.lessons.splice(index, 1)[0];
      s.lessons.splice(index + 1, 0, item);
    }
    setData(d);
  };

  const moveVenue = (programIndex: number,
    studyIndex: number,
    lessonIndex: number,
    index: number,
    direction: "up" | "down") => {
    const d = { ...data };
    const l = d.programs[programIndex].studies[studyIndex].lessons[lessonIndex];
    if (direction === "up") {
      const item = l.venues.splice(index - 1, 1)[0];
      l.venues.splice(index, 0, item);
    } else {
      const item = l.venues.splice(index, 1)[0];
      l.venues.splice(index + 1, 0, item);
    }
    setData(d);
  };

  const getVenues = (l: FeedLessonInterface, programIndex: number, studyIndex: number, lessonIndex: number) => {
    const result: React.JSX.Element[] = [];
    l.venues?.forEach((v, j) => {
      result.push(<TableRow key={l.id + "-" + v.id}>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          {j !== 0 && (
            <SmallButton
              icon="arrow_upward"
              onClick={() => {
                moveVenue(programIndex, studyIndex, lessonIndex, j, "up");
              }}
            />
          )}
          {j !== l.venues.length - 1 && (
            <SmallButton
              icon="arrow_downward"
              onClick={() => {
                moveVenue(programIndex, studyIndex, lessonIndex, j, "down");
              }}
            />
          )}
        </TableCell>

        <TableCell>
          <a
            href="about:blank"
            onClick={e => {
              e.preventDefault();
              handleEditVenue(programIndex, studyIndex, lessonIndex, j);
            }}>
            {v.name}
          </a>
        </TableCell>
      </TableRow>);
    });
    return result;
  };

  const getLessons = (s: FeedStudyInterface, programIndex: number, studyIndex: number) => {
    let result: React.JSX.Element[] = [];
    s.lessons?.forEach((l, j) => {
      result.push(<TableRow key={l.id}>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          {j !== 0 && (
            <SmallButton
              icon="arrow_upward"
              onClick={() => {
                moveLesson(programIndex, studyIndex, j, "up");
              }}
            />
          )}
          {j !== s.lessons.length - 1 && (
            <SmallButton
              icon="arrow_downward"
              onClick={() => {
                moveLesson(programIndex, studyIndex, j, "down");
              }}
            />
          )}
        </TableCell>

        <TableCell>
          <a
            href="about:blank"
            onClick={e => {
              e.preventDefault();
              handleEditLesson(programIndex, studyIndex, j);
            }}>
            {l.name}
          </a>
        </TableCell>

        <TableCell colSpan={2} style={{ textAlign: "right" }}>
          <SmallButton
            icon="add"
            text="Venue"
            onClick={() => {
              setEditProgramIndex(programIndex);
              setEditStudyIndex(studyIndex);
              setEditLessonIndex(j);
              setEditVenueIndex(-1);
            }}
          />
        </TableCell>
      </TableRow>);
      result = result.concat(getVenues(l, programIndex, studyIndex, j));
    });
    return result;
  };

  const getStudies = (p: FeedProgramInterface, programIndex: number) => {
    let result: React.JSX.Element[] = [];
    p.studies?.forEach((s, j) => {
      result.push(<TableRow key={s.id}>
        <TableCell></TableCell>
        <TableCell>
          {j !== 0 && (
            <SmallButton
              icon="arrow_upward"
              onClick={() => {
                moveStudy(programIndex, j, "up");
              }}
            />
          )}
          {j !== p.studies.length - 1 && (
            <SmallButton
              icon="arrow_downward"
              onClick={() => {
                moveStudy(programIndex, j, "down");
              }}
            />
          )}
        </TableCell>

        <TableCell>
          <a
            href="about:blank"
            onClick={e => {
              e.preventDefault();
              handleEditStudy(programIndex, j);
            }}>
            {s.name}
          </a>
        </TableCell>
        <TableCell></TableCell>
        <TableCell colSpan={2} style={{ textAlign: "right" }}>
          <SmallButton
            icon="add"
            text="Lesson"
            onClick={() => {
              setEditProgramIndex(programIndex);
              setEditStudyIndex(j);
              setEditLessonIndex(-1);
            }}
          />
        </TableCell>
      </TableRow>);
      result = result.concat(getLessons(s, programIndex, j));
    });
    return result;
  };

  const getPrograms = () => {
    let result: React.JSX.Element[] = [];

    data?.programs?.forEach((p, i) => {
      result.push(<TableRow key={p.id}>
        <TableCell>
          {i !== 0 && (
            <SmallButton
              icon="arrow_upward"
              onClick={() => {
                moveProgram(i, "up");
              }}
            />
          )}
          {i < data.programs.length - 1 && (
            <SmallButton
              icon="arrow_downward"
              onClick={() => {
                moveProgram(i, "down");
              }}
            />
          )}
        </TableCell>
        <TableCell colSpan={2}>
          <a
            href="about:blank"
            onClick={e => {
              e.preventDefault();
              setEditProgramIndex(i);
            }}>
            {p.name}
          </a>
        </TableCell>
        <TableCell colSpan={2} style={{ textAlign: "right" }}>
          <SmallButton
            icon="add"
            text="Study"
            onClick={() => {
              setEditProgramIndex(i);
              setEditStudyIndex(-1);
            }}
          />
        </TableCell>
      </TableRow>);
      result = result.concat(getStudies(p, i));
    });

    return result;
  };

  const handleEditStudy = (programIndex: number, index: number) => {
    setEditProgramIndex(programIndex);
    setEditStudyIndex(index);
  };

  const handleEditLesson = (programIndex: number, studyIndex: number, index: number) => {
    setEditProgramIndex(programIndex);
    setEditStudyIndex(studyIndex);
    setEditLessonIndex(index);
  };

  const handleEditVenue = (programIndex: number, studyIndex: number, lessonIndex: number, index: number) => {
    setEditProgramIndex(programIndex);
    setEditStudyIndex(studyIndex);
    setEditLessonIndex(lessonIndex);
    setEditVenueIndex(index);
  };

  const clearIndexes = () => {
    setEditProgramIndex(null);
    setEditStudyIndex(null);
    setEditLessonIndex(null);
    setEditVenueIndex(null);
  };

  const handleProgramSave = (program: FeedProgramInterface, cancelled: boolean) => {
    if (!cancelled) {
      const d = { ...data };
      if (!program && editProgramIndex > -1) {
        d.programs.splice(editProgramIndex, 1);
      } else {
        if (editProgramIndex > -1) {
          d.programs[editProgramIndex] = program;
        } else {
          if (!d.programs) d.programs = [];
          d.programs.push(program);
        }
      }
      setData(d);
    }
    clearIndexes();
  };

  const handleStudySave = (study: FeedStudyInterface, cancelled: boolean) => {
    if (!cancelled) {
      const d = { ...data };
      const program = d.programs[editProgramIndex];
      if (!study && editStudyIndex > -1) {
        program.studies.splice(editStudyIndex, 1);
      } else {
        if (editStudyIndex > -1) {
          program.studies[editStudyIndex] = study;
        } else {
          if (!program.studies) program.studies = [];
          program.studies.push(study);
        }
      }
      setData(d);
    }
    clearIndexes();
  };

  const handleLessonSave = (lesson: FeedLessonInterface, cancelled: boolean) => {
    if (!cancelled) {
      const d = { ...data };
      const study = d.programs[editProgramIndex].studies[editStudyIndex];
      if (!lesson && editLessonIndex > -1) {
        study.lessons.splice(editLessonIndex, 1);
      } else {
        if (editLessonIndex > -1) {
          study.lessons[editLessonIndex] = lesson;
        } else {
          if (!study.lessons) study.lessons = [];
          study.lessons.push(lesson);
        }
      }
      setData(d);
    }
    clearIndexes();
  };

  const handleVenueSave = (venue: FeedVenueLinkInterface, cancelled: boolean) => {
    if (!cancelled) {
      const d = { ...data };
      const lesson = d.programs[editProgramIndex].studies[editStudyIndex].lessons[editLessonIndex];
      if (!venue && editVenueIndex > -1) {
        lesson.venues.splice(editVenueIndex, 1);
      } else {
        if (editVenueIndex > -1) {
          lesson.venues[editVenueIndex] = venue;
        } else {
          if (!lesson.venues) lesson.venues = [];
          lesson.venues.push(venue);
        }
      }
      setData(d);
    }
    clearIndexes();
  };

  const feedUrl = searchParams.get("feedUrl");

  useEffect(() => {
    if (feedUrl) {
      fetch(feedUrl, { method: "GET", headers: { "Content-Type": "application/json" } })
        .then(res => {
          if (res.ok) return res.json();
          else throw new Error(res.statusText);
        })
        .then(data => {
          setData(data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [feedUrl]);

  let editProgram = null;
  let editStudy = null;
  let editLesson = null;
  let editVenue = null;

  if (editProgramIndex !== null && data) {
    if (editProgramIndex > -1 && editStudyIndex !== null) {
      if (editStudyIndex > -1 && editLessonIndex !== null) {
        if (editLessonIndex > -1 && editVenueIndex !== null) {
          if (editVenueIndex > -1) editVenue = data.programs[editProgramIndex].studies[editStudyIndex].lessons[editLessonIndex].venues[editVenueIndex];
          else editVenue = {} as FeedVenueLinkInterface;
        } else {
          if (editLessonIndex > -1) editLesson = data.programs[editProgramIndex].studies[editStudyIndex].lessons[editLessonIndex];
          else editLesson = {} as FeedLessonInterface;
        }
      } else {
        if (editStudyIndex > -1) editStudy = data.programs[editProgramIndex].studies[editStudyIndex];
        else editStudy = {} as FeedStudyInterface;
      }
    } else {
      if (editProgramIndex > -1) editProgram = data.programs[editProgramIndex];
      else editProgram = {} as FeedProgramInterface;
    }
  }

  if (!data) {
    return <></>;
  } else {
    return (
      <>
        <Grid container spacing={3}>
          <Grid size={{ md: 8, xs: 12 }}>
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
                  <ListIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "var(--c1d2)",
                      fontWeight: 600,
                      lineHeight: 1,
                      fontSize: "1.25rem"
                    }}>
                    Programs
                  </Typography>
                </Stack>

                <SmallButton
                  icon="add"
                  text="Program"
                  onClick={() => {
                    setEditProgramIndex(-1);
                  }}
                />
              </Box>

              <Box sx={{ maxHeight: "85vh", overflowY: "auto", pr: 2 }}>
                <Table id="olfTable" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Program</TableCell>
                      <TableCell>Study</TableCell>
                      <TableCell>Lesson</TableCell>
                      <TableCell>Venue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{getPrograms()}</TableBody>
                </Table>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ md: 4, xs: 12 }}>
            {editProgram && <OllProgramEdit program={editProgram} updatedCallback={handleProgramSave} />}
            {editStudy && <OllStudyEdit study={editStudy} updatedCallback={handleStudySave} />}
            {editLesson && <OllLessonEdit lesson={editLesson} updatedCallback={handleLessonSave} />}
            {editVenue && <OllVenueEdit venue={editVenue} updatedCallback={handleVenueSave} />}

            <Paper
              sx={{
                borderRadius: 2,
                border: "1px solid var(--admin-border)",
                boxShadow: "var(--admin-shadow-sm)",
                overflow: "hidden",
                mt: editProgram || editStudy || editLesson || editVenue ? 3 : 0
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
                  <StorageIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "var(--c1d2)",
                      fontWeight: 600,
                      lineHeight: 1,
                      fontSize: "1.25rem"
                    }}>
                    OLL File
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <SmallButton text="Upload" icon="upload" onClick={handleUpload} />
                  <SmallButton text="Download" icon="download" onClick={handleDownload} />
                </Stack>
                <input id="fileUpload" type="file" onChange={handleFileChange} style={{ display: "none" }} />
                <Box
                  sx={{
                    fontSize: 12,
                    overflow: "auto",
                    maxHeight: 333,
                    whiteSpace: "pre",
                    border: "1px solid var(--admin-border)",
                    borderRadius: 1,
                    backgroundColor: "var(--admin-bg-lighter)",
                    p: 2
                  }}>
                  {JSON.stringify(data, null, 2)}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }
}
