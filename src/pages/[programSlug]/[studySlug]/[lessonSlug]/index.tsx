import { GetStaticPaths, GetStaticProps } from "next";
import { Grid, Container, Icon } from "@mui/material";
import { Layout, Venue } from "@/components";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface, ArrayHelper, VenueInterface, ResourceInterface, BundleInterface, ExternalVideoInterface } from "@/utils";
import Error from "@/pages/_error";
import Image from "next/image";
import { Header } from "@/components/Header";
import Link from "next/link";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import React from "react";
import { Presenter } from "@/components/Presenter";


type Props = { program: ProgramInterface; study: StudyInterface; lesson: LessonInterface; venues: VenueInterface[]; resources: ResourceInterface[]; externalVideos: ExternalVideoInterface[]; bundles: BundleInterface[]; hasError: boolean; error: { message: string }; };

export default function LessonsPage(props: Props) {

  const [selectedVenue, setSelectedVenue] = React.useState<VenueInterface>(props.venues?.[0]);
  const [showPresenter, setShowPresenter] = React.useState<boolean>(false);
  const [print, setPrint] = React.useState<number>(0);

  const resources: ResourceInterface[] = [];

  selectedVenue?.sections?.forEach((s) => {
    s.roles?.forEach((r) => {
      r.actions?.forEach((a) => {
        if (a.resourceId) {
          if (props.resources) {
            const r: ResourceInterface = ArrayHelper.getOne(props.resources, "id", a.resourceId);
            if (r && resources.indexOf(r) === -1) resources.push(r);
          }
        }
      });
    });
  });

  const bundleIds = ArrayHelper.getUniqueValues(resources, "bundleId");
  const bundles = ArrayHelper.getAllArray(props.bundles, "id", bundleIds)
  resources.sort((a, b) => (a.name > b.name ? 1 : -1));


  if (props.hasError) {
    return <Error message={props.error.message} />
  }

  const title = props.program.name + ": " + props.lesson?.title + " - Free Church Curriculum";
  return (
    <Layout pageTitle={title} metaDescription={props.lesson.description} image={props.lesson.image} withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <Grid container spacing={2}>
              <Grid item md={7} xs={12}>
                <div className="breadcrumb"><Link href={"/" + props.program.slug}>{props.program.name}</Link>: <Link href={"/" + props.program.slug + "/" + props.study.slug }>{props.study.name}</Link></div>
                <h1>{props.lesson.title}</h1>
                {props.lesson.description && <div style={{marginBottom:20}}>{props.lesson.description}</div>}
                <a href="about:blank" onClick={(e) => { e.preventDefault(); setShowPresenter(true); }} className="cta"><Icon style={{float:"left", marginRight:10}}>play_circle</Icon>Start Lesson</a>
              </Grid>
            </Grid>

            <div style={{height:50}}></div>
            <Image src={props.lesson.image || "/not-found"} alt={props.lesson.name} width={320} height={180} className="badge" />
          </Container>
        </div>
      </div>


      <Grid container spacing={2}>
        <Grid item md={3} sm={12} style={{backgroundColor:"#FFF"}}>
          <LessonSidebar program={props.program} venues={props.venues} selectedVenue={selectedVenue} onVenueChange={(v) => { setSelectedVenue(v); }} bundles={bundles} externalVideos={props.externalVideos} onPrint={() => { setPrint(Math.random()) } } />
        </Grid>
        <Grid item md={9} sm={12}>
          <Container>
            <div style={{marginTop:60}}>
              <Venue useAccordion={false} venue={selectedVenue} resources={resources} externalVideos={props.externalVideos} bundles={bundles} print={print} />
            </div>
          </Container>
        </Grid>
      </Grid>

      {showPresenter && <Presenter venue={selectedVenue} onClose={() => { setShowPresenter(false); }} />}

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
    console.log("/lessons/public/slug/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug);
    const lessonData = await ApiHelper.getAnonymous("/lessons/public/slugAlt/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");
    const lesson: LessonInterface = lessonData.lesson;
    const study: StudyInterface = lessonData.study;
    const program: ProgramInterface = lessonData.program;
    const venues: VenueInterface[] = lessonData.venues;
    const bundles: BundleInterface[] = lessonData.bundles;
    const resources: ResourceInterface[] = lessonData.resources;
    const externalVideos: ExternalVideoInterface[] = lessonData.externalVideos;

    resources?.forEach(r => {
      if (r.variants) r.variants = ArrayHelper.getAll(r.variants, "hidden", false);
    });

    return {
      props: { program, study, lesson, venues, resources, externalVideos, bundles, hasError: false },
      revalidate: 30,
    };
  } catch (error: any) {
    return {
      props: {
        hasError: true, error: {
          message: error.message
        }
      }
    }
  }

};
