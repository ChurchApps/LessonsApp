"use client";

import { Layout, Lessons } from "@/components";
import { MarkdownPreviewLight } from "@churchapps/apphelper/dist/components/markdownEditor/MarkdownPreviewLight";
import { ProgramInterface, StudyInterface, LessonInterface } from "@/helpers/interfaces";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import { Grid, Container } from "@mui/material";
import Image from "next/image";
import { Header } from "@/components/Header";
import Link from "next/link";
import { ExternalProviderHelper } from "@/helpers/ExternalProviderHelper";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type PageParams = { providerId:string, programId:string, studyId:string }

export default function StudyPage() {
  const params = useParams<PageParams>();

  const [program, setProgram] = useState<ProgramInterface>(null);
  const [study, setStudy] = useState<StudyInterface>(null);
  const [lessons, setLessons] = useState<LessonInterface[]>([]);


  const loadData = async () => {
    const lessonList = await ApiHelper.getAnonymous("/externalProviders/" + params.providerId + "/lessons", "LessonsApi");
    const {study, program} = ExternalProviderHelper.getStudy(lessonList, params.programId as string, params.studyId as string);
    console.log("STUDY IS: ", study);

    setStudy(study);
    setProgram(program);
    setLessons(study.lessons);
  }

  useEffect(() => { loadData(); }, []);


  if (!study || !program) return <></>
  let title = program.name + ": " + study?.name + " - Free Church Curriculum";
  return (
    <Layout pageTitle={title} metaDescription={study.description} image={study.image} withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <Grid container spacing={2}>
              <Grid item md={7} xs={12}>
                <div className="breadcrumb"><Link href={"/external/" + params.providerId + "/" + program.id}>{program.name}</Link></div>
                <h1>{study.name}</h1>
              </Grid>
            </Grid>

            <div style={{height:50}}></div>
            <Image className="badge" src={study.image ?? "/not-found"} alt={study.name} width={320} height={180} />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="studyIntro">
            <h2>Lessons</h2>
            <div><MarkdownPreviewLight value={study.description} /></div>
          </div>
          {lessons?.length > 0 && (
            <Lessons lessons={lessons} slug={`/external/${params.providerId}/${program.id}/${study.id}`} />
          )}
        </Container>
      </div>
    </Layout>
  );
}

