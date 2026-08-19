import { useEffect, useMemo, useState } from "react";
import { ArrowDownward, ArrowUpward, Delete as DeleteIcon, EventNote as PlanIcon } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { ApiHelper, ExternalProviderInterface, LessonTreeInterface, YearPlanInterface, YearPlanWeekInterface } from "@/helpers";

interface Props {
  plan: YearPlanInterface;
  saving?: boolean;
  onChange: (plan: YearPlanInterface) => void;
  onSave: () => void;
  onCancel: () => void;
}

const LESSONS_SOURCE = "lessons.church";

export function YearPlanEditor(props: Props) {
  const [sources, setSources] = useState<{ id: string; name: string; tree: LessonTreeInterface }[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [programId, setProgramId] = useState("");
  const [studyId, setStudyId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [venueId, setVenueId] = useState("");

  useEffect(() => {
    const load = async () => {
      const native: LessonTreeInterface = await ApiHelper.getAnonymous("/lessons/public/tree", "LessonsApi");
      const list: { id: string; name: string; tree: LessonTreeInterface }[] = [{ id: LESSONS_SOURCE, name: "Lessons.church", tree: native || {} }];
      try {
        const providers: ExternalProviderInterface[] = await ApiHelper.get("/externalProviders", "LessonsApi");
        for (const p of providers || []) {
          if (!p.apiUrl) continue;
          try {
            const tree = await ApiHelper.fetchWithErrorHandling(p.apiUrl, { method: "GET" });
            list.push({ id: p.id || "", name: p.name || "Provider", tree: tree || {} });
          } catch {
            void 0;
          }
        }
      } catch {
        void 0;
      }
      setSources(list);
      setSourceId(current => list.some(s => s.id === current) ? current : (list[0]?.id || ""));
    };
    load();
  }, []);

  const source = sources.find(s => s.id === sourceId) || sources[0];
  const programs = source?.tree?.programs || [];
  const program = programs.find(p => p.id === programId);
  const studies = program?.studies || [];
  const study = studies.find(s => s.id === studyId);
  const lessons = study?.lessons || [];
  const lesson = lessons.find(l => l.id === lessonId);
  const venues = lesson?.venues || [];

  useEffect(() => {
    if (!programId && programs[0]) setProgramId(programs[0].id);
  }, [sourceId, programs, programId]);

  const defaultVenueId = useMemo(() => {
    if (venues.length === 0) return "";
    const prefs = (props.plan.venuePreference || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    for (const pref of prefs) {
      const exact = venues.find(v => (v.name || "").trim().toLowerCase() === pref);
      if (exact) return exact.id;
    }
    return venues[0].id;
  }, [venues, props.plan.venuePreference]);

  useEffect(() => { setVenueId(defaultVenueId); }, [defaultVenueId]);

  const setWeeks = (weeks: YearPlanWeekInterface[]) => props.onChange({ ...props.plan, weeks });

  const addWeek = () => {
    if (!lesson || !study || !program) return;
    const venue = venues.find(v => v.id === venueId) || venues[0];
    if (!venue) return;
    const nextWeek = (props.plan.weeks || []).reduce((max, w) => Math.max(max, w.week || 0), 0) + 1;
    props.onChange({
      ...props.plan,
      // yearPlans.programId is char(11) — only native program ids fit
      programId: props.plan.programId || (sourceId === LESSONS_SOURCE ? program.id : undefined),
      weeks: [
        ...(props.plan.weeks || []), {
          week: nextWeek,
          externalProviderId: sourceId === LESSONS_SOURCE ? undefined : sourceId,
          programId: program.id,
          studyId: study.id,
          lessonId: lesson.id,
          venueId: venue.id,
          studyName: study.name,
          lessonName: lesson.name,
          venueName: venue.name
        }
      ]
    });
  };

  const move = (index: number, dir: -1 | 1) => {
    const weeks = [...(props.plan.weeks || [])];
    const swap = index + dir;
    if (swap < 0 || swap >= weeks.length) return;
    const a = weeks[index].week;
    weeks[index].week = weeks[swap].week;
    weeks[swap].week = a;
    weeks.sort((x, y) => (x.week || 0) - (y.week || 0));
    setWeeks(weeks);
  };

  const removeWeek = (index: number) => {
    setWeeks((props.plan.weeks || []).filter((_, i) => i !== index).map((w, i) => ({ ...w, week: i + 1 })));
  };

  return (
    <Paper sx={{ flex: 2, width: "100%", border: "1px solid var(--admin-border)", borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ p: 2, backgroundColor: "var(--c1l7)", display: "flex", alignItems: "center", gap: 1 }}>
        <PlanIcon sx={{ color: "var(--c1d2)" }} />
        <Typography variant="h6" sx={{ color: "var(--c1d2)", fontWeight: 600 }}>{props.plan.id ? "Edit Plan" : "New Plan"}</Typography>
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <TextField fullWidth name="name" label="Name" value={props.plan.name || ""} onChange={(e) => props.onChange({ ...props.plan, name: e.target.value })} data-testid="year-plan-name" />
        <TextField fullWidth name="slug" label="Slug" value={props.plan.slug || ""} onChange={(e) => props.onChange({ ...props.plan, slug: e.target.value })} data-testid="year-plan-slug" />
        <TextField
          fullWidth
          name="venuePreference"
          label="Default venue preference"
          value={props.plan.venuePreference || ""}
          onChange={(e) => props.onChange({ ...props.plan, venuePreference: e.target.value })}
          helperText="Optional. Used when a week has no venue set. Comma-separated names, first match wins."
          data-testid="year-plan-venue-pref"
        />
        <FormControlLabel control={<Checkbox checked={!!props.plan.live} onChange={(e) => props.onChange({ ...props.plan, live: e.target.checked })} data-testid="year-plan-publish" />} label="Publish (visible to churches in B1 Admin)" />

        <Typography variant="subtitle2">Add a week from any curriculum</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <FormControl fullWidth>
            <InputLabel>Source</InputLabel>
            <Select label="Source" value={sourceId} onChange={(e) => { setSourceId(e.target.value); setProgramId(""); setStudyId(""); setLessonId(""); setVenueId(""); }} data-testid="year-plan-source">
              {sources.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Program</InputLabel>
            <Select label="Program" value={programId} onChange={(e) => { setProgramId(e.target.value); setStudyId(""); setLessonId(""); setVenueId(""); }} data-testid="year-plan-program">
              {programs.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <FormControl fullWidth>
            <InputLabel>Study</InputLabel>
            <Select label="Study" value={studyId} onChange={(e) => { setStudyId(e.target.value); setLessonId(""); setVenueId(""); }} data-testid="year-plan-study">
              {studies.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Lesson</InputLabel>
            <Select label="Lesson" value={lessonId} onChange={(e) => { setLessonId(e.target.value); setVenueId(""); }} data-testid="year-plan-lesson">
              {lessons.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Venue</InputLabel>
            <Select label="Venue" value={venueId} onChange={(e) => setVenueId(e.target.value)} data-testid="year-plan-venue">
              {venues.map(v => <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={addWeek} disabled={!lessonId || !venueId} data-testid="year-plan-add-week">Add</Button>
        </Stack>

        <Table size="small" data-testid="year-plan-weeks">
          <TableHead>
            <TableRow>
              <TableCell>Week</TableCell>
              <TableCell>Lesson</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {(props.plan.weeks || []).map((w, i) => (
              <TableRow key={w.id || i}>
                <TableCell>{w.week}</TableCell>
                <TableCell>{w.studyName} — {w.lessonName}</TableCell>
                <TableCell>{w.venueName || "—"}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => move(i, -1)} disabled={i === 0} data-testid={`year-plan-week-up-${i}`}><ArrowUpward fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => move(i, 1)} disabled={i === (props.plan.weeks || []).length - 1} data-testid={`year-plan-week-down-${i}`}><ArrowDownward fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => removeWeek(i)} data-testid={`year-plan-week-delete-${i}`}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={props.onCancel} data-testid="year-plan-cancel">Cancel</Button>
          <Button variant="contained" onClick={props.onSave} disabled={props.saving || !props.plan.name} data-testid="year-plan-save">{props.saving ? "Saving..." : "Save"}</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
