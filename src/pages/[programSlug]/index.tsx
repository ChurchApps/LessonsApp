import { GetStaticPaths, GetStaticProps } from "next";
import { Container, Box, Typography } from "@mui/material";
import { Layout, Studies } from "@/components";
import { ProgramInterface, ApiHelper, ProviderInterface, StudyInterface, } from "@/utils";
import { MarkdownPreview } from "@/components"
import Error from "../_error";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";

type Props = {
  program: ProgramInterface;
  provider: ProviderInterface;
  studies: StudyInterface[];
  hasError: Boolean;
  error: {
    message: string;
  };
};

export default function ProgramPage(props: Props) {

  if (props.hasError) {
    return <Error message={props.error.message} />
  }

  const video = props.program.videoEmbedUrl && (<EmbeddedVideo videoEmbedUrl={props.program.videoEmbedUrl} title={props.program.name} />);

  return (
    <Layout pageTitle={props.program.name + " - Free Church Curriculum"} metaDescription={props.program.description} image={props.program.image}>
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
  try {
    const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params?.programSlug, "LessonsApi");
    const provider: ProviderInterface = await ApiHelper.getAnonymous("/providers/public/" + program?.providerId, "LessonsApi");
    const studies: StudyInterface[] = await ApiHelper.getAnonymous("/studies/public/program/" + program?.id, "LessonsApi");

    return {
      props: { program, provider, studies, hasError: false},
      revalidate: 30,
    };
  } catch (error:any) {
    return {
      props: {
        hasError: true, error: {
          message: error.message
        }
      }
    }
  }
};
