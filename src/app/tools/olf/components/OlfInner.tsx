"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Description as DescriptionIcon, Storage as StorageIcon, List as ListIcon } from "@mui/icons-material";
import { MarkdownEditor, MarkdownPreviewLight, SmallButton } from "@churchapps/apphelper";
import { Presenter } from "@/components/Presenter";
import { OlfActionEdit } from "@/components/open-lesson/OlfActionEdit";
import { OlfPrintPreview } from "@/components/open-lesson/OlfPrintPreview";
import { OlfSectionEdit } from "@/components/open-lesson/OlfSectionEdit";
import { FeedActionInterface, FeedSectionInterface, FeedVenueInterface, PlaylistFileInterface } from "@/helpers";

export default function OlfInner() {
  const [data, setData] = useState<FeedVenueInterface>({} as FeedVenueInterface);
  const [editSectionIndex, setEditSectionIndex] = useState<number>(null);
  const [editActionIndex, setEditActionIndex] = useState<number>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [presenterFiles, setPresenterFiles] = useState<PlaylistFileInterface[]>(null);

  const searchParams = useSearchParams();

  const loadPresenterData = () => {
    const result: PlaylistFileInterface[] = [];
    data?.sections.forEach(s => {
      s.actions?.forEach(a => {
        a.files?.forEach(f => {
          let file: PlaylistFileInterface = {
            name: f.name,
            url: f.url,
            seconds: f.seconds || 3600,
            loopVideo: f.loop || false
          };
          result.push(file);
        });
      });
    });

    setPresenterFiles(result);
  };

  const handleMarkdownChange = (newValue: string) => {
    let d = { ...data };
    d.lessonDescription = newValue;
    setData(d);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let d = { ...data };
    switch (e.currentTarget.name) {
      case "name":
        d.name = e.currentTarget.value;
        break;
      case "lessonName":
        d.lessonName = e.currentTarget.value;
        break;
      case "lessonImage":
        d.lessonImage = e.currentTarget.value;
        break;
      case "studyName":
        d.studyName = e.currentTarget.value;
        break;
      case "programName":
        d.programName = e.currentTarget.value;
        break;
    }
    setData(d);
  };

  const handleDownload = () => {
    const content = JSON.stringify(data, null, 2);
    const link = document.createElement("a");
    const file = new Blob([content], { type: "application/json" });
    link.href = URL.createObjectURL(file);
    link.download = "olf.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleUpload = () => {
    const f: any = document.getElementById("fileUpload");
    f.click();
  };

  const handleFileChange = () => {
    const f: any = document.getElementById("fileUpload");
    const reader = new FileReader();
    reader.onload = (e: any) => {
      setData(null);
      setTimeout(() => {
        setData(JSON.parse(e.target.result));
      }, 50);
    };
    reader.readAsText(f.files[0]);
  };

  const getFiles = (a: FeedActionInterface) => {
    if (a.actionType === "play") {
      const fileCount = a.files.length;
      return (
        <i>
          {fileCount} file{fileCount !== 1 && "s"}
        </i>
      );
    } else {
      return null;
    }
  };

  const getActions = (s: FeedSectionInterface, sectionIndex: number) => {
    let result: JSX.Element[] = [];
    s.actions?.forEach((a, j) => {
      result.push(
        <TableRow key={"action-" + sectionIndex + "-" + j}>
          <TableCell></TableCell>
          <TableCell>
            {j !== 0 && (
              <SmallButton
                icon="arrow_upward"
                onClick={() => {
                  moveAction(sectionIndex, j, "up");
                }}
              />
            )}
            {j !== s.actions.length - 1 && (
              <SmallButton
                icon="arrow_downward"
                onClick={() => {
                  moveAction(sectionIndex, j, "down");
                }}
              />
            )}
          </TableCell>

          <TableCell>
            <a
              href="about:blank"
              onClick={e => {
                e.preventDefault();
                handleEditAction(sectionIndex, j);
              }}>
              {a.actionType}
            </a>
          </TableCell>
          <TableCell>
            <MarkdownPreviewLight value={a.content} />
          </TableCell>
          <TableCell style={{ whiteSpace: "nowrap" }}>{getFiles(a)}</TableCell>
        </TableRow>
      );
    });
    return result;
  };

  const getSections = () => {
    let result: JSX.Element[] = [];
    data?.sections?.forEach((s, i) => {
      result.push(
        <TableRow key={"section-" + s.name}>
          <TableCell>
            {i !== 0 && (
              <SmallButton
                icon="arrow_upward"
                onClick={() => {
                  moveSection(i, "up");
                }}
              />
            )}
            {i < data.sections.length - 1 && (
              <SmallButton
                icon="arrow_downward"
                onClick={() => {
                  moveSection(i, "down");
                }}
              />
            )}
          </TableCell>
          <TableCell colSpan={2}>
            <a
              href="about:blank"
              onClick={e => {
                e.preventDefault();
                setEditSectionIndex(i);
              }}>
              {s.name}
            </a>
          </TableCell>
          <TableCell colSpan={2} style={{ textAlign: "right" }}>
            <SmallButton
              icon="add"
              text="Action"
              onClick={() => {
                setEditSectionIndex(i);
                setEditActionIndex(-1);
              }}
            />
          </TableCell>
        </TableRow>
      );
      result = result.concat(getActions(s, i));
    });
    return result;
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    let d = { ...data };
    if (direction === "up") {
      const item = d.sections.splice(index - 1, 1)[0];
      d.sections.splice(index, 0, item);
    } else {
      const item = d.sections.splice(index, 1)[0];
      d.sections.splice(index + 1, 0, item);
    }
    setData(d);
  };

  const moveAction = (sectionIndex: number, index: number, direction: "up" | "down") => {
    let d = { ...data };
    let s = d.sections[sectionIndex];
    if (direction === "up") {
      const item = s.actions.splice(index - 1, 1)[0];
      s.actions.splice(index, 0, item);
    } else {
      const item = s.actions.splice(index, 1)[0];
      s.actions.splice(index + 1, 0, item);
    }
    setData(d);
  };

  const handleEditAction = (sectionIndex: number, index: number) => {
    setEditSectionIndex(sectionIndex);
    setEditActionIndex(index);
  };

  let editAction = null;
  let editSection = null;
  if (editSectionIndex !== null && data) {
    if (editSectionIndex > -1 && editActionIndex !== null) {
      if (editActionIndex > -1) editAction = data.sections[editSectionIndex].actions[editActionIndex];
      else editAction = { actionType: "say", content: "" };
    } else {
      if (editSectionIndex > -1) editSection = data.sections[editSectionIndex];
      else editSection = { name: "" };
    }
  }

  const handleSectionSave = (section: FeedSectionInterface, cancelled: boolean) => {
    if (!cancelled) {
      const d = { ...data };
      if (!section && editSectionIndex > -1) {
        d.sections.splice(editSectionIndex, 1);
      } else {
        if (editSectionIndex > -1) {
          d.sections[editSectionIndex] = section;
        } else {
          if (!d.sections) d.sections = [];
          d.sections.push(section);
        }
      }
      setData(d);
    }
    setEditSectionIndex(null);
  };

  const handleActionSave = (action: FeedActionInterface, cancelled: boolean) => {
    if (!cancelled) {
      const d = { ...data };
      if (!action && editActionIndex > -1) {
        d.sections[editSectionIndex].actions.splice(editActionIndex, 1);
      } else {
        if (editActionIndex > -1) {
          d.sections[editSectionIndex].actions[editActionIndex] = action;
        } else {
          const sect = d.sections[editSectionIndex];
          if (!sect.actions) sect.actions = [];
          sect.actions.push(action);
        }
      }
      setData(d);
    }
    setEditSectionIndex(null);
    setEditActionIndex(null);
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

  if (!data) {
    return <></>;
  } else {
    return (
      <>
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
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
                  <DescriptionIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "var(--c1d2)",
                      fontWeight: 600,
                      lineHeight: 1,
                      fontSize: "1.25rem"
                    }}>
                    Venue Details
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      label="Program Name"
                      fullWidth
                      name="programName"
                      value={data.programName || ""}
                      onChange={handleChange}
                      placeholder="The Ark Kids"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Study Name"
                      fullWidth
                      name="studyName"
                      value={data.studyName || ""}
                      onChange={handleChange}
                      placeholder="Peace"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      label="Lesson Name"
                      fullWidth
                      name="lessonName"
                      value={data.lessonName || ""}
                      onChange={handleChange}
                      placeholder="I Can Have Peace When I'm Angry"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Lesson Image"
                      fullWidth
                      name="lessonImage"
                      value={data.lessonImage || ""}
                      onChange={handleChange}
                      placeholder="https://content.lessons.church/lessons/LokAPfneEmp.png"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontSize: 13, pl: 1, mb: 1, color: "var(--text-secondary)" }}>
                      Lesson Description
                    </Typography>
                    <MarkdownEditor value={data.lessonDescription || ""} onChange={handleMarkdownChange} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Venue Name"
                      fullWidth
                      name="name"
                      value={data.name || ""}
                      onChange={handleChange}
                      placeholder="Classroom"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid item md={4} xs={12}>
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
                  <StorageIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "var(--c1d2)",
                      fontWeight: 600,
                      lineHeight: 1,
                      fontSize: "1.25rem"
                    }}>
                    OLF File
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <SmallButton text="Upload" icon="upload" onClick={handleUpload} />
                  <SmallButton text="Download" icon="download" onClick={handleDownload} />
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <SmallButton
                    icon="print"
                    text="Print Preview"
                    onClick={() => {
                      setShowPrintPreview(true);
                    }}
                  />
                  <SmallButton icon="play_arrow" text="Play Media" onClick={loadPresenterData} />
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

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
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
                    Sections
                  </Typography>
                </Stack>
                
                <SmallButton
                  icon="add"
                  text="Section"
                  onClick={() => {
                    setEditSectionIndex(-1);
                  }}
                />
              </Box>

              <Box sx={{ maxHeight: "85vh", overflowY: "auto", pr: 2 }}>
                <Table id="olfTable" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Section</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell colSpan={2}>Content</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{getSections()}</TableBody>
                </Table>
              </Box>
            </Paper>
          </Grid>
          <Grid item md={4} xs={12}>
            {editAction && <OlfActionEdit action={editAction} updatedCallback={handleActionSave} />}
            {editSection && <OlfSectionEdit section={editSection} updatedCallback={handleSectionSave} />}
          </Grid>
          </Grid>
        </Box>

        {showPrintPreview && (
          <OlfPrintPreview
            feed={data}
            onClose={() => {
              setShowPrintPreview(false);
            }}
          />
        )}
        {presenterFiles && (
          <Presenter
            files={presenterFiles}
            onClose={() => {
              setPresenterFiles(null);
            }}
          />
        )}
      </>
    );
  }
}
