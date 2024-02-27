import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { ApiHelper, ClassroomInterface, LessonInterface, ProgramInterface, ScheduleInterface, StudyInterface } from "@/utils";
import Link from "next/link";
import { ArrayHelper, DateHelper, ChurchInterface, MarkdownPreview } from "@churchapps/apphelper";
import { AppBar, Container, Grid, Stack } from "@mui/material";
import { ExternalProviderHelper } from "@/utils/ExternalProviderHelper";

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
  const upcoming = router.query.upcoming === "1";

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
        if (filteredSchedules[0].externalProviderId) await loadExternalLessons(filteredSchedules[0].externalProviderId, filteredSchedules);
        else await loadLessons(lessonIds);
      }
    }
  }

  const loadExternalLessons = async (externalProviderId:string, schedules:ScheduleInterface[]) => {
    const data = await ApiHelper.get("/externalProviders/" + externalProviderId + "/lessons", "LessonsApi");
    const lessonArray:LessonInterface[] = [];
    const studyArray:StudyInterface[] = [];
    console.log("Data is: ", data);

    schedules.forEach(s => {
      const {lesson, study, program} = ExternalProviderHelper.getLesson(data, s.programId, s.studyId, s.lessonId);
      if (lesson)
      {
        lessonArray.push(lesson);
        if (!ArrayHelper.getOne(studyArray, "id", lesson.studyId)) studyArray.push(study);
      }
    });
    console.log("Lessons are: ", lessonArray);
    console.log("Studies are: ", studyArray);

    setLessons(lessonArray);
    setStudies(studyArray);
    setPrograms(data.programs);
    //const program = ArrayHelper.getOne(data.programs, "id", programId);




    /*
    setLessons(l);
    const studyIds = ArrayHelper.getIds(l, "studyId");
    if (studyIds.length > 0) {
      const st = await ApiHelper.get("/studies/public/ids?ids=" + studyIds, "LessonsApi");
      setStudies(st);
    }*/
  }

  const loadLessons = async (lessonIds:string[]) => {
    const l = await ApiHelper.get("/lessons/public/ids?ids=" + lessonIds, "LessonsApi");
    setLessons(l);
    const studyIds = ArrayHelper.getIds(l, "studyId");
    if (studyIds.length > 0) {
      const st = await ApiHelper.get("/studies/public/ids?ids=" + studyIds, "LessonsApi");
      setStudies(st);
    }
  }

  const filterSchedules = (s: ScheduleInterface[]) => {
    let result:ScheduleInterface[] = []
    if (upcoming)
    {
      for (let i = s.length - 1; i >= 0; i--) {
        if (DateHelper.toDate(s[i].scheduledDate) < new Date()) s.splice(i, 1);
      }
      result = s.sort((a, b) => (DateHelper.toDate(a.scheduledDate) > DateHelper.toDate(b.scheduledDate)) ? 1 : -1)
      if (result.length > 4) result.splice(4, result.length - 4)
    } else {
      for (let i = s.length - 1; i >= 0; i--) {
        if (DateHelper.toDate(s[i].scheduledDate) > new Date()) s.splice(i, 1);
      }
      if (s.length > 4) s.splice(0, s.length - 4)
      result = s.sort((a, b) => (DateHelper.toDate(a.scheduledDate) < DateHelper.toDate(b.scheduledDate)) ? 1 : -1)
    }
    return result;
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    schedules?.forEach(s => {
      const { lesson, study, program } = getRowData(s);
      if (program) {
        const url = (s.externalProviderId)
          ? "/external/" + s.externalProviderId + "/" + s.programId + "/" + s.studyId + "/" + s.lessonId
          : "/" + program.slug + "/" + study.slug + "/" + lesson.slug;

        result.push(<Link href={url} key={lesson.id} style={{ textDecoration: "none", color: "inherit" }}>
          <h3>{DateHelper.prettyDate(DateHelper.toDate(s.scheduledDate))}</h3>
          <Grid container spacing={3} style={{ paddingBottom: 20, borderBottom: "1px solid #CCC" }}>
            <Grid item md={3} xs={12}>
              <img
                src={lesson.image}
                style={{ verticalAlign: "middle" }}
                alt={lesson.name}
                className="img-fluid"
              />
            </Grid>
            <Grid item md={9} xs={12}>
              <div className="title">{lesson.name}</div>
              <h3 style={{ fontSize: "28px", fontWeight: 600, margin: "0 0 8px 0" }}>{lesson.title}</h3>
              <p style={{ margin: "0 0 16px 0" }}>
                <MarkdownPreview value={lesson.description} />
              </p>
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
      result.study = ArrayHelper.getOne(studies, "id", schedule.studyId);
      if (result.study) {
        result.program = ArrayHelper.getOne(programs, "id", schedule.programId);
      }
    }
    console.log("ROW DATA is: ", result)
    return result;
  }

  let logoUrl = "/images/logo-dark.png";
  if (churchSettings?.logoDark) logoUrl = churchSettings.logoDark;

  return (
    <Layout withoutNavbar={true} withoutFooter={true}>
      <div>
        <div id="studyHero" style={{minHeight:70}}>
          <div className="content">
            <Container fixed>
              <AppBar id="navbar" position="fixed">
                <Container>
                  <Stack direction="row" justifyContent="left" alignItems="center">
                    <Link href="/" className="logo"><img src={logoUrl} alt="Lessons.church - Free Curriculum for Churches" className="img-fluid" /></Link>
                    <b style={{ color: "#FFF", fontSize: 24, paddingLeft:30 }}>{church?.name}</b>
                  </Stack>

                </Container>
              </AppBar>
              <div id="navSpacer" />
            </Container>
          </div>
        </div>
      </div>
      <Container fixed>
        <h1>{classroom?.name} Lesson</h1>
        {getRows()}
      </Container>

      <br />
    </Layout>
  );
}
