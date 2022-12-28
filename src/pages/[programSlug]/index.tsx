import { GetStaticPaths, GetStaticProps } from "next";
import { Container, Box, Typography } from "@mui/material";
import { Layout, Studies } from "@/components";
import { ProgramInterface, ApiHelper, ProviderInterface, StudyInterface, } from "@/utils";
import { MarkdownPreview } from "@/components"

type Props = {
  program: ProgramInterface;
  provider: ProviderInterface;
  studies: StudyInterface[];
};

export default function ProgramPage(props: Props) {
  const video = props.program.videoEmbedUrl && (
    <div className="videoWrapper">
      <iframe
        width="992"
        height="558"
        src={props.program.videoEmbedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );

  return (
    <Layout pageTitle={props.program.name + " - Lessons.church"} metaDescription={props.program.description} image={props.program.image}>
      <div className="pageSection">
        <Container fixed>
          <Box sx={{ textAlign: "center" }}>
            <Typography component="h2" sx={{ fontSize: "36px", fontWeight: 700, marginBottom: "30px" }}>
              {props.provider?.name || ""}: <span>{props.program.name}</span>
            </Typography>
            <p>
              <i>{props.program.shortDescription}</i>
            </p>
          </Box>
          <div><MarkdownPreview value={props.program.description} /></div>
          {video}
          <br />
          <br />
          {props.studies?.length > 0 && (
            <Studies studies={props.studies} slug={`/${props.program.slug}`} />
          )}
        </Container>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");

  const paths = programs
    .filter((p) => p.slug)
    .map((p) => ({ params: { programSlug: p.slug } }));

  return { paths, fallback: "blocking", };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params.programSlug, "LessonsApi");
  const provider: ProviderInterface = await ApiHelper.getAnonymous("/providers/public/" + program.providerId, "LessonsApi");
  const studies: StudyInterface[] = await ApiHelper.getAnonymous("/studies/public/program/" + program.id, "LessonsApi");

  return {
    props: { program, provider, studies, },
    revalidate: 30,
  };
};
