import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { ApiHelper, ChurchInterface, ClassroomInterface, LessonInterface, ProgramInterface, ScheduleInterface, SettingInterface, StudyInterface } from "@/utils";
import Link from "next/link";
import { ArrayHelper, DateHelper } from "@/appBase/helpers";
import { AppBar, Container, Grid, Stack, Typography } from "@mui/material";
import { Header } from "@/components/Header";


export default function Venue() {
  const [classroom, setClassroom] = useState<ClassroomInterface>(null);
  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);
  const [lessons, setLessons] = useState<LessonInterface[]>([]);
  const [studies, setStudies] = useState<StudyInterface[]>([])
  const [programs, setPrograms] = useState<ProgramInterface[]>([])
  const [church, setChurch] = useState<ChurchInterface>(null)
  const [churchSettings, setChurchSettings] = useState<any>({})

  const router = useRouter();
  const id = router.query.id;

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    if (id) {
      ApiHelper.get("/programs/public", "LessonsApi").then(p => setPrograms(p));

      const c = await ApiHelper.get("/classrooms/" + id, "LessonsApi");
      setClassroom(c);

      ApiHelper.get("/churches/" + c.churchId, "MembershipApi").then(ch => {
        setChurch(ch);
        ApiHelper.get("/settings/public/" + ch.id, "MembershipApi").then(set => setChurchSettings(set));
      });

      const s = await ApiHelper.get("/schedules/public/classroom/" + c.id, "LessonsApi")
      const filteredSchedules = filterSchedules(s);
      setSchedules(filteredSchedules);
      const lessonIds = ArrayHelper.getIds(filteredSchedules, "lessonId");
      if (lessonIds.length > 0) {
        const l = await ApiHelper.get("/lessons/public/ids?ids=" + lessonIds, "LessonsApi");
        setLessons(l);
        const studyIds = ArrayHelper.getIds(l, "studyId");
        if (studyIds.length > 0) {
          const st = await ApiHelper.get("/studies/public/ids?ids=" + studyIds, "LessonsApi");
          setStudies(st);
        }
      }
    }
  }

  const filterSchedules = (s: ScheduleInterface[]) => {
    for (let i = s.length - 1; i >= 0; i--) {
      if (DateHelper.toDate(s[i].scheduledDate) > new Date()) {
        s.splice(i, 1);
      }
    }

    if (s.length > 4) s.splice(0, s.length - 4)
    return s.sort((a, b) => (DateHelper.toDate(a.scheduledDate) < DateHelper.toDate(b.scheduledDate)) ? 1 : -1)
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    schedules?.forEach(s => {
      const { lesson, study, program } = getRowData(s);
      if (program) {
        const url = "/" + program.slug + "/" + study.slug + "/" + lesson.slug;
        result.push(<Link href={url} key={lesson.id} style={{ textDecoration: "none", color: "inherit" }}>
          <h3>{DateHelper.prettyDate(DateHelper.toDate(s.scheduledDate))}</h3>
          <Grid container spacing={3} style={{ paddingBottom: 20, borderBottom: "1px solid #CCC" }}>
            <Grid item md={3} xs={12}>
              <img
                src={lesson.image}
                style={{ verticalAlign: "middle" }}
                alt={lesson.name}
              />
            </Grid>
            <Grid item md={9} xs={12}>
              <div className="title">{lesson.name}</div>
              <h3 style={{ fontSize: "28px", fontWeight: 600, margin: "0 0 8px 0" }}>{lesson.title}</h3>
              <p style={{ margin: "0 0 16px 0" }}>{lesson.description}</p>
            </Grid>
          </Grid>
        </Link>);
      }
    });

    return result;
  }

  const getRowData = (schedule: ScheduleInterface) => {
    let result: { lesson: LessonInterface, study: StudyInterface, program: ProgramInterface } = { lesson: null, study: null, program: null };
    result.lesson = ArrayHelper.getOne(lessons, "id", schedule.lessonId);
    if (result.lesson) {
      result.study = ArrayHelper.getOne(studies, "id", result.lesson.studyId);
      if (result.study) {
        result.program = ArrayHelper.getOne(programs, "id", result.study.programId);
      }
    }
    return result;
  }

  let logoUrl = "/images/logo.png";
  if (churchSettings?.logoLight) logoUrl = churchSettings.logoLight;

  return (
    <Layout withoutNavbar={true} withoutFooter={true}>
      <div>
        <AppBar id="navbar" position="fixed">
          <Container>
            <Stack direction="row" justifyContent="left" alignItems="center">
              <Link href="/" className="logo"><img src={logoUrl} alt="Lessons.church - Free Curriculum for Churches" /></Link>
              <b style={{ color: "#000", fontSize: 24 }}>{church?.name}</b>
            </Stack>

          </Container>
        </AppBar>
        <div id="navSpacer" />
      </div>
      <Container fixed>
        <h1>{classroom?.name} Lesson</h1>
        {getRows()}
      </Container>

      <br />
    </Layout>
  );
}
