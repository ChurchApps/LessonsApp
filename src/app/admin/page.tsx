"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import {
  Add as AddIcon,
  Assessment as StatsIcon,
  Book as BookIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  FileUpload as FilesIcon,
  Layers as LayersIcon,
  LocationOn as VenueIcon,
  School as SchoolIcon
} from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { Loading, PageHeader } from "@churchapps/apphelper";
import { BundleList, ErrorBoundary, LessonEdit, ProgramEdit, StudyEdit, VenueList } from "@/components";
import { Wrapper } from "@/components/Wrapper";
import { ApiHelper, ArrayHelper, LessonInterface, ProgramInterface, ProviderInterface, StudyInterface } from "@/helpers";
import { revalidate } from "../actions";

type EntityType = "program" | "study" | "lesson";
type PanelTab = "details" | "files" | "venues";

interface PanelState { entityType: EntityType; entity: any; tab: PanelTab; }

export default function Admin() {
  const router = useRouter();
  const { isAuthenticated } = ApiHelper;

  const [providers, setProviders] = useState<ProviderInterface[]>(null);
  const [programs, setPrograms] = useState<ProgramInterface[]>(null);
  const [studies, setStudies] = useState<StudyInterface[]>(null);
  const [lessons, setLessons] = useState<LessonInterface[]>(null);

  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [expandedStudyId, setExpandedStudyId] = useState<string>("");
  const [panel, setPanel] = useState<PanelState | null>(null);

  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, []);
  useEffect(() => { if (isAuthenticated) loadData(); }, [isAuthenticated]);

  useEffect(() => {
    if (programs && programs.length > 0) {
      if (!selectedProgramId || !programs.some(p => p.id === selectedProgramId)) {
        setSelectedProgramId(programs[0].id);
      }
    }
  }, [programs]);

  async function loadData() {
    ApiHelper.get("/providers", "LessonsApi").then((d: any) => setProviders(d));
    ApiHelper.get("/programs", "LessonsApi").then((d: any) => setPrograms(d));
    ApiHelper.get("/studies", "LessonsApi").then((d: any) => setStudies(d));
    ApiHelper.get("/lessons", "LessonsApi").then((d: any) => setLessons(d));
  }

  function clearCache() {
    startTransition(async () => { revalidate("all"); });
  }

  function openPanel(entityType: EntityType, entity: any, tab: PanelTab = "details") {
    setPanel({ entityType, entity, tab });
  }
  function closePanel() { setPanel(null); }

  function handlePanelSaved(saved?: any) {
    const currentPanel = panel;
    const obj = Array.isArray(saved) ? saved[0] : saved;

    setPanel(null);
    loadData();

    if (currentPanel) {
      if (currentPanel.entityType === "program" && obj?.id) setSelectedProgramId(obj.id);
      if (currentPanel.entityType === "study" && obj?.programId) setSelectedProgramId(obj.programId);
      if (currentPanel.entityType === "lesson" && obj?.studyId) {
        const s = studies?.find(x => x.id === obj.studyId);
        if (s) setSelectedProgramId(s.programId);
        setExpandedStudyId(obj.studyId);
      }
    }
  }

  const selectedProgram = programs?.find(p => p.id === selectedProgramId) || null;
  const studyCountFor = (programId: string) => (studies || []).filter(s => s.programId === programId).length;
  const lessonCountFor = (programId: string) => {
    const sids = (studies || []).filter(s => s.programId === programId).map(s => s.id);
    return (lessons || []).filter(l => sids.includes(l.studyId)).length;
  };
  const programStudies: StudyInterface[] = selectedProgramId
    ? ArrayHelper.getAll(studies || [], "programId", selectedProgramId)
      .slice()
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    : [];

  function renderProgramItem(p: ProgramInterface) {
    const isActive = selectedProgramId === p.id;
    const sCount = studyCountFor(p.id);
    const lCount = lessonCountFor(p.id);
    return (
      <Box
        key={p.id}
        className="program-item"
        onClick={() => { setSelectedProgramId(p.id); openPanel("program", p, "details"); }}
        sx={{
          padding: "12px 16px",
          borderLeft: "3px solid",
          borderLeftColor: isActive ? "var(--c1)" : "transparent",
          cursor: "pointer",
          transition: "background 0.15s ease, border-color 0.15s ease",
          background: isActive ? "var(--c1l7)" : "transparent",
          "&:hover": { background: isActive ? "var(--c1l7)" : "var(--admin-bg-light)" },
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SchoolIcon sx={{ fontSize: "1rem", color: isActive ? "var(--c1d1)" : "var(--text-secondary)" }} />
          <Typography
            component="h6"
            sx={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: isActive ? "var(--c1d1)" : "var(--text-color)",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: 0
            }}>
            {p.name}
          </Typography>
        </Stack>
        <Typography component="div" sx={{ fontSize: "0.75rem", color: "var(--text-secondary)", paddingLeft: "24px" }}>
          {sCount} {sCount === 1 ? "study" : "studies"}{lCount > 0 ? ` · ${lCount} lessons` : ""}
        </Typography>
      </Box>
    );
  }

  function renderStudyCard(s: StudyInterface) {
    const isExpanded = expandedStudyId === s.id;
    const isSelected = panel?.entityType === "study" && panel?.entity?.id === s.id;
    const studyLessons: LessonInterface[] = ArrayHelper.getAll(lessons || [], "studyId", s.id);
    return (
      <Box
        key={s.id}
        sx={{
          background: "var(--admin-surface)",
          border: "1px solid",
          borderColor: isSelected ? "var(--c1)" : "var(--admin-border-light)",
          boxShadow: isSelected ? "0 0 0 2px var(--c1l6)" : undefined,
          borderRadius: 2,
          marginBottom: "10px",
          overflow: "hidden",
          transition: "box-shadow 0.15s ease",
          "&:hover": { boxShadow: "var(--admin-shadow-sm)" }
        }}>
        <Stack
          direction="row"
          alignItems="center"
          gap={1.5}
          onClick={() => {
            setExpandedStudyId(isExpanded ? "" : s.id);
            openPanel("study", s, "details");
          }}
          sx={{
            padding: "14px 18px",
            cursor: "pointer",
            transition: "background 0.15s ease",
            "&:hover": { background: "var(--admin-bg-light)" }
          }}>
          <Box sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            background: "var(--c1l7)",
            color: "var(--c1d1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <LayersIcon sx={{ fontSize: "1.125rem" }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "var(--text-color)",
                marginBottom: "2px",
                lineHeight: 1.3
              }}>
              {s.name}
            </Typography>
            {s.shortDescription && (
              <Typography
                component="p"
                sx={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  marginBottom: 0
                }}>
                {s.shortDescription}
              </Typography>
            )}
          </Box>
          <Box sx={{
            fontSize: "0.75rem",
            padding: "3px 10px",
            background: "var(--admin-bg-light)",
            color: "var(--text-secondary)",
            borderRadius: 12,
            fontWeight: 500,
            flexShrink: 0
          }}>
            {studyLessons.length} {studyLessons.length === 1 ? "lesson" : "lessons"}
          </Box>
        </Stack>
        {isExpanded && (
          <Box sx={{ background: "var(--admin-bg-lighter)", borderTop: "1px solid var(--admin-border-light)" }}>
            {studyLessons.length === 0 ? (
              <Box sx={{ padding: "16px 18px 16px 56px", color: "var(--text-secondary)", fontStyle: "italic", fontSize: "0.875rem" }}>
                No lessons yet.
              </Box>
            ) : studyLessons.map((l, idx) => renderLessonRow(l, idx, studyLessons.length))}
            <Button
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => openPanel("lesson", { studyId: s.id }, "details")}
              sx={{
                justifyContent: "flex-start",
                padding: "12px 18px 12px 56px",
                color: "var(--c1)",
                borderTop: "1px dashed var(--admin-border-light)",
                borderRadius: 0,
                fontSize: "0.8125rem",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": { background: "var(--c1l7)" }
              }}>
              Add lesson to this study
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  function renderLessonRow(l: LessonInterface, idx: number, total: number) {
    return (
      <Stack
        key={l.id}
        direction="row"
        alignItems="center"
        gap={1.5}
        onClick={() => openPanel("lesson", l, "details")}
        sx={{
          padding: "12px 18px 12px 32px",
          borderBottom: idx === total - 1 ? "none" : "1px solid var(--admin-border-light)",
          cursor: "pointer",
          transition: "background 0.15s ease",
          "&:hover": { background: "var(--admin-bg-light)" }
        }}>
        <Box sx={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "var(--c1l6)",
          color: "var(--c1d1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 600,
          flexShrink: 0
        }}>
          {idx + 1}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="p"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--c1d1)",
              marginBottom: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
            {l.name}: {l.title}
          </Typography>
        </Box>
      </Stack>
    );
  }

  function renderPanelHeader() {
    if (!panel) return null;
    const { entityType, entity } = panel;
    const eyebrow = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    const name = entity?.id ? entity.name : `New ${entityType}`;
    const Icon = entityType === "program" ? SchoolIcon : entityType === "study" ? LayersIcon : BookIcon;
    return (
      <Stack
        direction="row"
        alignItems="center"
        gap={1.5}
        sx={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, var(--c1l7) 0%, var(--admin-surface) 100%)",
          borderBottom: "1px solid var(--admin-border-light)"
        }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: 1.25,
          background: "var(--c1)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Icon sx={{ fontSize: "1.25rem" }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="div" sx={{ fontSize: "0.6875rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
            {eyebrow}
          </Typography>
          <Typography component="div" sx={{
            fontSize: "1.0625rem",
            fontWeight: 500,
            color: "var(--text-color)",
            lineHeight: 1.2,
            marginTop: "2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {name}
          </Typography>
        </Box>
        <IconButton size="small" title="Close panel" onClick={closePanel}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    );
  }

  function renderPanelTabs() {
    if (!panel) return null;
    const tabs: { id: PanelTab; label: string; Icon: any }[] = [
      { id: "details", label: "Details", Icon: DescriptionIcon },
      { id: "files", label: "Files", Icon: FilesIcon }
    ];
    if (panel.entityType === "lesson") tabs.push({ id: "venues", label: "Venues", Icon: VenueIcon });
    const isPersisted = !!panel.entity?.id;
    return (
      <Stack
        direction="row"
        sx={{
          borderBottom: "1px solid var(--admin-border-light)",
          background: "var(--admin-surface)",
          padding: "0 12px"
        }}>
        {tabs.map(t => {
          const isActive = panel.tab === t.id;
          const isDisabled = !isPersisted && t.id !== "details";
          return (
            <Box
              key={t.id}
              component="button"
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && setPanel({ ...panel, tab: t.id })}
              sx={{
                flex: 1,
                padding: "12px 8px",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: isActive ? "var(--c1)" : "var(--text-secondary)",
                background: "none",
                border: 0,
                borderBottom: "2px solid",
                borderBottomColor: isActive ? "var(--c1)" : "transparent",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.5 : 1,
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontFamily: "inherit",
                "&:hover": isDisabled ? {} : { color: isActive ? "var(--c1)" : "var(--text-color)" }
              }}>
              <t.Icon sx={{ fontSize: "0.875rem" }} />
              {t.label}
            </Box>
          );
        })}
      </Stack>
    );
  }

  function renderPanelBody() {
    if (!panel) return null;
    const { entityType, entity, tab } = panel;
    if (entityType === "program") {
      if (tab === "details") return <ProgramEdit program={entity} updatedCallback={handlePanelSaved} onClose={closePanel} />;
      if (tab === "files" && entity?.id) return <BundleList contentType="program" contentId={entity.id} contentDisplayName={entity.name} />;
    }
    if (entityType === "study") {
      if (tab === "details") return <StudyEdit study={entity} updatedCallback={handlePanelSaved} onClose={closePanel} />;
      if (tab === "files" && entity?.id) return <BundleList contentType="study" contentId={entity.id} contentDisplayName={entity.name} />;
    }
    if (entityType === "lesson") {
      if (tab === "details") return <LessonEdit lesson={entity} updatedCallback={handlePanelSaved} onClose={closePanel} />;
      if (tab === "files" && entity?.id) return <BundleList contentType="lesson" contentId={entity.id} contentDisplayName={entity.name} />;
      if (tab === "venues" && entity?.id) return <VenueList lessonId={entity.id} />;
    }
    return null;
  }

  function renderEmptyPanel() {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={1.5}
        sx={{ flex: 1, padding: 4, color: "var(--text-secondary)", textAlign: "center" }}>
        <DescriptionIcon sx={{ fontSize: "2.5rem", opacity: 0.5 }} />
        <Typography sx={{ fontSize: "0.875rem", marginBottom: 0 }}>
          Select an item to view details, files, and stats.
        </Typography>
      </Stack>
    );
  }

  const headerActions = [
    <Button
      key="add-program"
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={() => openPanel("program", { providerId: providers?.[0]?.id || "", live: false }, "details")}
      sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.1)" } }}>
      Add Program
    </Button>,
    <Button
      key="clear-cache"
      variant="outlined"
      startIcon={<ClearIcon />}
      onClick={clearCache}
      sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.1)" } }}>
      Clear Cache
    </Button>
  ];

  return (
    <Wrapper>
      <PageHeader title="Program Management" subtitle="Manage programs, studies, and lessons for your curriculum">
        {headerActions}
      </PageHeader>

      <Box
        data-testid="admin-workspace"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr 420px" },
          height: { xs: "auto", md: "calc(100vh - 130px)" },
          minHeight: 600,
          backgroundColor: "var(--admin-bg)",
          overflow: "hidden"
        }}>
        <Box
          data-testid="admin-nav"
          sx={{
            background: "var(--admin-surface)",
            borderRight: "1px solid var(--admin-border)",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            overflow: "hidden"
          }}>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--admin-border-light)",
              background: "var(--admin-bg-light)"
            }}>
            <Typography
              component="h2"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                flex: 1,
                lineHeight: 1.2,
                margin: 0
              }}>
              Programs
            </Typography>
            <IconButton
              size="small"
              title="Add program"
              onClick={() => openPanel("program", { providerId: providers?.[0]?.id || "", live: false }, "details")}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {programs === null ? (
              <Box sx={{ p: 2 }}><Loading /></Box>
            ) : programs.length === 0 ? (
              <Typography sx={{ padding: "20px 16px", textAlign: "center", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                No programs yet.
              </Typography>
            ) : programs.map(renderProgramItem)}
          </Box>
        </Box>

        <Box
          data-testid="admin-main"
          sx={{
            background: "var(--admin-bg)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            minWidth: 0
          }}>
          {selectedProgram ? (
            <>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
                sx={{
                  padding: "20px 28px 16px",
                  background: "var(--admin-surface)",
                  borderBottom: "1px solid var(--admin-border-light)"
                }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    component="h6"
                    sx={{
                      fontSize: "1.375rem",
                      fontWeight: 500,
                      color: "var(--text-color)",
                      marginBottom: "2px",
                      lineHeight: 1.2
                    }}>
                    {selectedProgram.name}
                  </Typography>
                  <Typography component="p" sx={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: 0 }}>
                    {selectedProgram.shortDescription ? `${selectedProgram.shortDescription} · ` : ""}
                    {studyCountFor(selectedProgram.id)} {studyCountFor(selectedProgram.id) === 1 ? "study" : "studies"}
                    {lessonCountFor(selectedProgram.id) > 0 ? ` · ${lessonCountFor(selectedProgram.id)} lessons` : ""}
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" gap={0.5} flexShrink={0}>
                  <IconButton size="small" title="View Stats" onClick={() => router.push(`/admin/stats/${selectedProgram.id}`)}>
                    <StatsIcon fontSize="small" />
                  </IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    title="Add Study"
                    onClick={() => openPanel("study", { programId: selectedProgram.id }, "details")}
                    sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" }, ml: 1 }}>
                    Add Study
                  </Button>
                </Stack>
              </Stack>

              <Box sx={{ padding: "16px 28px 32px" }}>
                {studies === null ? <Loading /> : programStudies.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: "center", color: "var(--text-secondary)" }}>
                    <LayersIcon sx={{ fontSize: "3rem", color: "var(--text-secondary)", mb: 1 }} />
                    <Typography sx={{ fontSize: "0.9375rem", marginBottom: 2 }}>No studies yet for this program.</Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => openPanel("study", { programId: selectedProgram.id }, "details")}
                      sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" } }}>
                      Add Study
                    </Button>
                  </Box>
                ) : programStudies.map(renderStudyCard)}
              </Box>
            </>
          ) : programs && programs.length === 0 ? (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 4, color: "var(--text-secondary)", textAlign: "center" }}>
              <Box>
                <SchoolIcon sx={{ fontSize: "4rem", color: "var(--text-secondary)", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "var(--text-secondary)", mb: 1 }}>No programs yet</Typography>
                <Typography variant="body2" sx={{ color: "var(--text-secondary)", mb: 3 }}>Create your first program to get started</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => openPanel("program", { providerId: providers?.[0]?.id || "", live: false }, "details")}
                  sx={{ backgroundColor: "var(--c1)", "&:hover": { backgroundColor: "var(--c1d1)" } }}>
                  Add Program
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 4 }}><Loading /></Box>
          )}
        </Box>

        <Box
          data-testid="admin-panel"
          sx={{
            background: "var(--admin-surface)",
            borderLeft: "1px solid var(--admin-border)",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            overflow: "hidden"
          }}>
          {panel ? (
            <>
              {renderPanelHeader()}
              {renderPanelTabs()}
              <Box sx={{ flex: 1, overflowY: "auto" }}>
                <ErrorBoundary>{renderPanelBody()}</ErrorBoundary>
              </Box>
            </>
          ) : renderEmptyPanel()}
        </Box>
      </Box>
    </Wrapper>
  );
}
