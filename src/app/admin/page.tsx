"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { Add as AddIcon, Assessment as StatsIcon, Book as BookIcon, Clear as ClearIcon, Edit as EditIcon, ExpandLess as CollapseIcon, ExpandMore as ExpandIcon, FileUpload as FilesIcon, Layers as LayersIcon, LocationOn as VenueIcon, School as SchoolIcon } from "@mui/icons-material";
import { Box, Button, Container, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Loading } from "@churchapps/apphelper";
import { BundleList, ErrorBoundary, LessonEdit, ProgramEdit, StudyEdit, VenueList } from "@/components";
import { PageHeader } from "@churchapps/apphelper";
import { Wrapper } from "@/components/Wrapper";
import { ApiHelper, ArrayHelper, LessonInterface, ProgramInterface, ProviderInterface, StudyInterface } from "@/helpers";
import { revalidate } from "../actions";

export default function Admin() {
  const [providers, setProviders] = useState<ProviderInterface[]>(null);
  const [programs, setPrograms] = useState<ProgramInterface[]>(null);
  const [studies, setStudies] = useState<StudyInterface[]>(null);
  const [lessons, setLessons] = useState<LessonInterface[]>(null);

  const [editProgram, setEditProgram] = useState<ProgramInterface>(null);
  const [editStudy, setEditStudy] = useState<StudyInterface>(null);
  const [editLesson, setEditLesson] = useState<LessonInterface>(null);
  const [venuesLessonId, setVenuesLessonId] = useState<string>(null);
  const [resourceContentType, setResourceContentType] = useState<string>(null);
  const [resourceContentId, setResourceContentId] = useState<string>(null);
  const [resourceName, setResourceName] = useState<string>(null);
  const router = useRouter();
  const { isAuthenticated } = ApiHelper;
  const [expandedProgramId, setExpandedProgramId] = useState<string>("");
  const [expandedStudyId, setExpandedStudyId] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  async function loadData() {
    ApiHelper.get("/providers", "LessonsApi").then((data: any) => {
      setProviders(data);
    });
    ApiHelper.get("/programs", "LessonsApi").then((data: any) => {
      setPrograms(data);
    });
    ApiHelper.get("/studies", "LessonsApi").then((data: any) => {
      setStudies(data);
    });
    ApiHelper.get("/lessons", "LessonsApi").then((data: any) => {
      setLessons(data);
    });
  }

  function clearEdits() {
    setEditProgram(null);
    /*
    setEditProgram({
      id: '',
      providerId: '',
      name: '',
      slug: '',
      image: '',
      shortDescription: '',
      description: '',
      videoEmbedUrl: '',
      live: false,
      aboutSection: ''
    });*/
    setEditStudy(null);
    setEditLesson(null);
    setVenuesLessonId(null);
  }

  const scrollToEdit = () => {
    setTimeout(() => {
      const editPanel = document.getElementById('edit-panel');
      if (editPanel) {
        editPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleUpdated = () => {
    loadData();
    setEditProgram(null);
    setEditStudy(null);
    setEditLesson(null);
  };

  function showResources(contentType: string, contentId: string, name: string) {
    setResourceContentType(contentType);
    setResourceContentId(contentId);
    setResourceName(name);
    scrollToEdit();
  }

  function getPrograms() {
    const result: React.JSX.Element[] = [];
    programs.forEach(p => {
      if (typeof p.id !== "string") p.id = "";
      if (typeof p.providerId !== "string") p.providerId = "";
      if (typeof p.name !== "string") p.name = "";
      if (typeof p.slug !== "string") p.slug = "";
      if (typeof p.image !== "string") p.image = "";
      if (typeof p.shortDescription !== "string") p.shortDescription = "";
      if (typeof p.description !== "string") p.description = "";
      if (typeof p.videoEmbedUrl !== "string") p.videoEmbedUrl = "";
      if (typeof p.live !== "boolean") p.live = false;
      if (typeof p.aboutSection !== "string") p.aboutSection = "";

      const isExpanded = expandedProgramId === p.id;

      result.push(<Paper
        key={p.id}
        sx={{
          borderRadius: 2,
          border: "1px solid var(--admin-border)",
          boxShadow: "var(--admin-shadow-sm)",
          overflow: "hidden",
          mb: 2
        }}>
        <Box
          sx={{
            p: 2,
            borderBottom: isExpanded ? "1px solid var(--admin-border)" : "none",
            backgroundColor: "var(--c1l7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            "&:hover": { backgroundColor: "var(--c1l6)" }
          }}
          onClick={() => setExpandedProgramId(isExpanded ? "" : p.id)}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <SchoolIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
            <Typography
              variant="h6"
              sx={{
                color: "var(--c1d2)",
                fontWeight: 600,
                lineHeight: 1,
                fontSize: "1.25rem"
              }}>
              {p.name}
            </Typography>
            {p.shortDescription && (
              <Typography
                variant="body2"
                sx={{
                  color: "var(--c1d1)",
                  fontStyle: "italic",
                  ml: 1
                }}>
                {p.shortDescription}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/admin/stats/" + p.id);
              }}
              sx={{ color: "var(--c1d2)" }}
              title="View Stats">
              <StatsIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                clearEdits();
                setEditStudy({ programId: p.id });
                scrollToEdit();
              }}
              sx={{ color: "var(--c1d2)" }}
              title="Add Study">
              <AddIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                clearEdits();
                showResources("program", p.id, p.name);
              }}
              sx={{ color: "var(--c1d2)" }}
              title="Manage Files">
              <FilesIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                clearEdits();
                setEditProgram(p);
                scrollToEdit();
              }}
              sx={{ color: "var(--c1d2)" }}
              title="Edit Program">
              <EditIcon fontSize="small" />
            </IconButton>

            {isExpanded ? <CollapseIcon sx={{ color: "var(--c1d2)" }} /> : <ExpandIcon sx={{ color: "var(--c1d2)" }} />}
          </Stack>
        </Box>

        {isExpanded && (
          <Box sx={{ p: 0 }}>
            {getStudies(p.id)}
          </Box>
        )}
      </Paper>);
    });
    return result;
  }

  function getStudies(programId: string) {
    const result: React.JSX.Element[] = [];
    if (studies) {
      ArrayHelper.getAll(studies, "programId", programId).forEach(s => {
        const isExpanded = expandedStudyId === s.id;

        result.push(<Box
          key={s.id}
          sx={{
            borderBottom: "1px solid var(--admin-border)",
            "&:last-child": { borderBottom: "none" }
          }}>
          <Box
            sx={{
              p: 2,
              pl: 4,
              backgroundColor: "var(--admin-bg-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              "&:hover": { backgroundColor: "var(--admin-bg)" }
            }}
            onClick={() => setExpandedStudyId(isExpanded ? "" : s.id)}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <LayersIcon sx={{ color: "var(--c1d1)", fontSize: "1.25rem" }} />
              <Typography
                variant="subtitle1"
                sx={{
                  color: "var(--c1d1)",
                  fontWeight: 500,
                  lineHeight: 1
                }}>
                {s.name}
              </Typography>
              {s.shortDescription && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--c1)",
                    fontStyle: "italic",
                    ml: 1
                  }}>
                  {s.shortDescription}
                </Typography>
              )}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  clearEdits();
                  setEditLesson({ studyId: s.id });
                  scrollToEdit();
                }}
                sx={{ color: "var(--c1d1)" }}
                title="Add Lesson">
                <AddIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  clearEdits();
                  showResources("study", s.id, s.name);
                }}
                sx={{ color: "var(--c1d1)" }}
                title="Manage Files">
                <FilesIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  clearEdits();
                  setEditStudy(s);
                  scrollToEdit();
                }}
                sx={{ color: "var(--c1d1)" }}
                title="Edit Study">
                <EditIcon fontSize="small" />
              </IconButton>

              {isExpanded ? <CollapseIcon sx={{ color: "var(--c1d1)" }} /> : <ExpandIcon sx={{ color: "var(--c1d1)" }} />}
            </Stack>
          </Box>

          {isExpanded && (
            <Box sx={{ backgroundColor: "var(--admin-bg-lighter)" }}>
              {getLessons(s.id)}
            </Box>
          )}
        </Box>);
      });
    }
    return result;
  }

  function getLessons(studyId: string) {
    const result: React.JSX.Element[] = [];
    if (lessons) {
      const studyLessons = ArrayHelper.getAll(lessons, "studyId", studyId);

      if (studyLessons.length === 0) {
        result.push(<Box
          key="no-lessons"
          sx={{
            p: 3,
            pl: 6,
            textAlign: "center",
            color: "var(--text-secondary)",
            fontStyle: "italic"
          }}>
          <Typography variant="body2">No lessons yet. Click the + button above to add one.</Typography>
        </Box>);
      } else {
        studyLessons.forEach((l, index) => {
          result.push(<Box
            key={l.id}
            sx={{
              p: 2,
              pl: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: index === studyLessons.length - 1 ? "none" : "1px solid var(--admin-border-light)",
              "&:hover": { backgroundColor: "var(--admin-bg)" }
            }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                clearEdits();
                setEditLesson(l);
                scrollToEdit();
              }}>
              <BookIcon sx={{ color: "var(--c1)", fontSize: "1.125rem" }} />
              <Typography
                variant="body1"
                sx={{
                  color: "var(--c1)",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" }
                }}>
                {l.name}: {l.title}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                size="small"
                onClick={() => {
                  clearEdits();
                  setVenuesLessonId(l.id);
                  scrollToEdit();
                }}
                sx={{ color: "var(--c1)" }}
                title="Manage Venues">
                <VenueIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => {
                  clearEdits();
                  showResources("lesson", l.id, l.name);
                }}
                sx={{ color: "var(--c1)" }}
                title="Manage Files">
                <FilesIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => {
                  clearEdits();
                  setEditLesson(l);
                  scrollToEdit();
                }}
                sx={{ color: "var(--c1)" }}
                title="Edit Lesson">
                <EditIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>);
        });
      }
    }
    return result;
  }

  function getProgramsList() {
    if (programs === null) return <Box sx={{ p: 3 }}><Loading /></Box>;
    if (programs.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
          <SchoolIcon sx={{ fontSize: "4rem", color: "var(--text-secondary)", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "var(--text-secondary)", mb: 1 }}>No programs yet</Typography>
          <Typography variant="body2" sx={{ color: "var(--text-secondary)", mb: 3 }}>Create your first program to get started</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              clearEdits();
              setEditProgram({ providerId: providers?.length > 0 ? providers[0].id : "", live: false });
              scrollToEdit();
            }}
            sx={{
              backgroundColor: "var(--c1)",
              "&:hover": { backgroundColor: "var(--c1d1)" }
            }}>
            Add Program
          </Button>
        </Box>
      );
    }
    return <Box sx={{ p: 2 }}>{getPrograms()}</Box>;
  }

  function getSidebar() {
    const result: React.JSX.Element[] = [];
    if (editProgram) {
      result.push(<ProgramEdit program={editProgram} updatedCallback={handleUpdated} key="programEdit" />);
    } else if (editStudy) {
      result.push(<StudyEdit study={editStudy} updatedCallback={handleUpdated} key="studyEdit" />);
    } else if (editLesson) {
      result.push(<LessonEdit lesson={editLesson} updatedCallback={handleUpdated} key="lessonEdit" />);
    } else if (venuesLessonId) {
      result.push(<VenueList lessonId={venuesLessonId} key="venueLesson" />);
    } else if (resourceContentType && resourceContentId) {
      result.push(<BundleList
        contentType={resourceContentType}
        contentId={resourceContentId}
        key="bundleList"
        contentDisplayName={resourceName}
      />);
    }
    return result;
  }

  function clearCache() {
    startTransition(async () => {
      revalidate("all");
    });
  }

  const headerActions = [<Button
    key="add-program"
    variant="outlined"
    startIcon={<AddIcon />}
    onClick={() => {
      clearEdits();
      setEditProgram({ providerId: providers?.length > 0 ? providers[0].id : "", live: false });
      scrollToEdit();
    }}
    sx={{
      color: "white",
      borderColor: "rgba(255,255,255,0.5)",
      "&:hover": {
        borderColor: "white",
        backgroundColor: "rgba(255,255,255,0.1)"
      }
    }}>
      Add Program
  </Button>, <Button
    key="clear-cache"
    variant="outlined"
    startIcon={<ClearIcon />}
    onClick={clearCache}
    sx={{
      color: "white",
      borderColor: "rgba(255,255,255,0.5)",
      "&:hover": {
        borderColor: "white",
        backgroundColor: "rgba(255,255,255,0.1)"
      }
    }}>
      Clear Cache
  </Button>];

  return (
    <Wrapper>
      <PageHeader
        icon={<SchoolIcon />}
        title="Program Management"
        subtitle="Manage programs, studies, and lessons for your curriculum"
      >
        {headerActions}
      </PageHeader>

      <Container maxWidth="xl" sx={{ p: 3, backgroundColor: "var(--admin-bg)" }}>
        {/* Edit Panel - appears at top when editing */}
        {getSidebar().length > 0 && (
          <Box sx={{ mb: 3 }} id="edit-panel">
            <ErrorBoundary>
              {getSidebar()}
            </ErrorBoundary>
          </Box>
        )}

        {/* Programs List - Full Width */}
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
                Programs
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: 0 }}>
            {getProgramsList()}
          </Box>
        </Paper>
      </Container>
    </Wrapper>
  );
}
