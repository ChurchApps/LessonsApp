import { GetStaticPaths, GetStaticProps } from "next";
import { Grid, Container, Icon } from "@mui/material";
import { Layout, Venue } from "@/components";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface, ArrayHelper, FeedVenueInterface, PlaylistFileInterface, AnalyticsHelper } from "@/utils";
import Error from "@/pages/_error";
import Image from "next/image";
import { Header } from "@/components/Header";
import Link from "next/link";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import React from "react";
import { Presenter } from "@/components/Presenter";


type Props = { lessonData: { venues: FeedVenueInterface[] }; hasError: boolean; error: { message: string }; };

export default function LessonsPage(props: Props) {

  const [selectedVenue, setSelectedVenue] = React.useState<FeedVenueInterface>(props.lessonData?.venues?.[0]);
  const [print, setPrint] = React.useState<number>(0);
  const [presenterFiles, setPresenterFiles] = React.useState<PlaylistFileInterface[]>(null);

  const loadPresenterData = () => {
    AnalyticsHelper.logEvent("Presenter", "Start", selectedVenue.name);
    ApiHelper.get("/venues/playlist/" + selectedVenue.id + "?mode=web", "LessonsApi").then(data => {
      const result: PlaylistFileInterface[] = [];
      data?.messages?.forEach((m:any) => {
        m.files?.forEach((f:PlaylistFileInterface) => { result.push(f) })
      });
      setPresenterFiles(result);
    });
  }

  if (props.hasError) {
    return <Error message={props.error.message} />
  }

  const title = selectedVenue.programName + ": " + selectedVenue.lessonName + " - Free Church Curriculum";
  return (
    <Layout pageTitle={title} metaDescription={selectedVenue.lessonDescription} image={selectedVenue.lessonImage} withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <Grid container spacing={2}>
              <Grid item md={7} xs={12}>
                <div className="breadcrumb"><Link href={"/" + selectedVenue.programSlug}>{selectedVenue.programName}</Link>: <Link href={"/" + selectedVenue.programSlug + "/" + selectedVenue.studySlug }>{selectedVenue.studyName}</Link></div>
                <h1>{selectedVenue.lessonName}</h1>
                {selectedVenue.lessonDescription && <div style={{marginBottom:20}}>{selectedVenue.lessonDescription}</div>}
                <a href="about:blank" onClick={(e) => { e.preventDefault(); loadPresenterData(); }} className="cta"><Icon style={{float:"left", marginRight:10}}>play_circle</Icon>Start Lesson</a>
              </Grid>
            </Grid>

            <div style={{height:50}}></div>
            <Image src={selectedVenue.lessonImage || "/not-found"} alt={selectedVenue.lessonName} width={320} height={180} className="badge" />
          </Container>
        </div>
      </div>


      <Grid container spacing={2}>
        <Grid item md={3} sm={12} style={{backgroundColor:"#FFF"}}>
          <LessonSidebar venues={props.lessonData?.venues} selectedVenue={selectedVenue} onVenueChange={(v) => { setSelectedVenue(v); }} onPrint={() => { setPrint(Math.random()) } } />
        </Grid>
        <Grid item md={9} sm={12}>
          <Container>
            <div style={{marginTop:60}}>
              <Venue useAccordion={false} venue={selectedVenue} print={print} />
            </div>
          </Container>
        </Grid>
      </Grid>

      {presenterFiles && <Presenter files={presenterFiles} onClose={() => { setPresenterFiles(null); }} />}

    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");
  const programsIds = programs.map((p) => p.id);

  const studies: StudyInterface[] = await ApiHelper.getAnonymous(`/studies/public/programs?ids=${escape(programsIds.join(","))}`, "LessonsApi");
  const studyIds = studies.map((s) => s.id);

  const lessons: LessonInterface[] = await ApiHelper.getAnonymous(`/lessons/public/studies?ids=${escape(studyIds.join(","))}`, "LessonsApi");

  const paths = lessons.map((l) => {
    const study: StudyInterface = ArrayHelper.getOne(studies, "id", l.studyId);
    const program: ProgramInterface = ArrayHelper.getOne(programs, "id", study.programId);
    return { params: { programSlug: program.slug, studySlug: study.slug, lessonSlug: l.slug, }, };
  });

  return { paths, fallback: "blocking", };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {

    const lessonData = await ApiHelper.getAnonymous("/lessons/public/slugAlt/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");
    console.log("just below lessonData: ", lessonData)
    return {
      props: { lessonData, hasError: false },
      revalidate: 30,
    };
  } catch (error: any) {
    console.log("inside catch: ", error)
    return {
      props: {
        hasError: true, error: {
          message: error.message
        }
      },
      revalidate: 1
    }
  }


};
