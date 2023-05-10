import { GetStaticPaths, GetStaticProps } from "next";
import { Grid, Container, Box, FormControl, InputLabel, Select, MenuItem, Card } from "@mui/material";
import { Layout, Venues } from "@/components";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface, ArrayHelper, VenueInterface, ResourceInterface, BundleInterface, ExternalVideoInterface } from "@/utils";
import { MarkdownPreview } from "@/components";
import Error from "@/pages/_error";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SectionAlt } from "@/components/lessonAlt/SectionAlt";

type Props = { program: ProgramInterface; study: StudyInterface; lesson: LessonInterface; venues: VenueInterface[]; resources: ResourceInterface[]; externalVideos: ExternalVideoInterface[]; bundles: BundleInterface[]; hasError: boolean; error: { message: string }; };

export default function LessonsPage(props: Props) {

  const [selectedVenue, setSelectedVenue] = useState<VenueInterface>(props.venues[0]);
  const [affixSidebar, setAffixSidebar] = useState(false);


  useEffect(() => {
    const onScroll = (e:any) => {
      const elTop = document.getElementById("sidebarContainer")?.offsetTop
      setAffixSidebar(e.target.documentElement.scrollTop > elTop - 70);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [affixSidebar]);

  const handleVenueChange = () => {

  }


  const getVenueOptions = () => props.venues.map((v) => <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>)

  if (props.hasError) {
    return <Error message={props.error.message} />
  }

  const video = props.lesson.videoEmbedUrl
    ? (<Grid container spacing={3}>
      <Grid item md={2} sm={0} />
      <Grid item md={8} sm={12}>
        <EmbeddedVideo videoEmbedUrl={props.lesson.videoEmbedUrl} title={props.lesson.title} />
      </Grid>
    </Grid>)
    : (<Grid container spacing={3}>
      <Grid item md={2} sm={0} />
      <Grid item md={8} sm={12}>
        <Image src={props.lesson.image || ""} className="profilePic" alt={props.study.name} width={752} height={423} /><br /><br />
      </Grid>
    </Grid>);



  const sidebarStyle:any = {marginBottom:20, padding:10}

  if (affixSidebar) {
    sidebarStyle.position = "fixed"
    sidebarStyle.top = 70
  }


  const title = props.program.name + ": " + props.lesson?.title + " - Free Church Curriculum";
  return (
    <Layout pageTitle={title} metaDescription={props.lesson.description} image={props.lesson.image}>
      <div className="pageSection">
        <Container fixed>
          <Box sx={{ textAlign: "center" }}>
            <div className="title">
              {props.program?.name}: <span>{props.study?.name}</span>
            </div>
            <h2 style={{ marginTop: 0 }}>
              {props.lesson?.name}: <span>{props.lesson?.title}</span>
            </h2>
            <p>{props.lesson?.description}</p>
          </Box>
          {video}

          <br />
          <hr />
          <br />
          <Grid container spacing={3}>
            <Grid item md={3} sm={12} id="sidebarContainer">
              <Card style={sidebarStyle} id="sidebar" data-spy="affix" data-offset-top="100">
                <div>
                  <h4 style={{marginTop:0}}>Venue</h4>
                  <Select fullWidth size="small" label={"Venue"} style={{backgroundColor:"#FFF"}} value={selectedVenue?.id} onChange={handleVenueChange}>{getVenueOptions()}</Select>
                  <h4>Sections</h4>
                  {selectedVenue?.sections?.map((s) => (s.roles.length>0) ? <div><a href={"#anchor-" + s?.id}>{s.name}</a></div> : null )}
                </div>
              </Card>
            </Grid>
            <Grid item md={9} sm={12}>
              {selectedVenue?.sections?.map((s) =>
                <Card style={{marginBottom:20 }}>
                  <SectionAlt section={s} resources={props.resources} externalVideos={props.externalVideos} activeSectionId={""} toggleActive={function (id: string): void {
                  } } />
                </Card>
              )}
            </Grid>
          </Grid>

          {props.program.aboutSection && (
            <>
              <hr />
              <h4>About {props.program.name}</h4>
              <MarkdownPreview value={props.program.aboutSection} />
            </>
          )}
        </Container>
      </div>
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
    const lessonData = await ApiHelper.getAnonymous("/lessons/public/slug/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");
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
