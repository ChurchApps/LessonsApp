import { GetStaticPaths, GetStaticProps } from "next";
import { Container, Icon } from "@mui/material";
import { Layout, Studies, VideoModal } from "@/components";
import { ApiHelper, ArrayHelper, } from "@/utils";
import { MarkdownPreview } from "@churchapps/apphelper"
import Error from "../../../_error";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import { Header } from "@/components/Header";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  program: any;
  providerId: string;
  hasError: Boolean;
  error: {
    message: string;
  };
};

export default function ProgramPage(props: Props) {
  const [filteredStudies, setFilteredStudies] = useState(props.program.studies);
  const [category, setCategory] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setFilteredStudies(props.program.studies);
  }, [category]);

  if (props.hasError) {
    return <Error message={props.error.message} />
  }

  const video = props.program.videoEmbedUrl && (<EmbeddedVideo videoEmbedUrl={props.program.videoEmbedUrl} title={props.program.name} />);

  return (
    <Layout pageTitle={props.program.name + " - Free Church Curriculum"} metaDescription={props.program.description} image={props.program.image} withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <h1>{props.program.name}</h1>
            <div style={{marginBottom:20}}>{props.program.shortDescription}</div>
            {video && <a href="about:blank" onClick={(e) => { e.preventDefault(); setShowVideo(true); }} className="cta"><Icon style={{float:"left", marginRight:10}}>play_circle</Icon>Watch Trailer</a>}
            <div style={{height:90}}></div>
            <Image src={props.program.image || "/not-found"} alt={props.program.name} width={320} height={180} className="badge" />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="programIntro">
            <h2>Studies</h2>
            <div><MarkdownPreview value={props.program.description} /></div>
          </div>

          {filteredStudies?.length > 0 && (
            <Studies studies={filteredStudies} slug={`/external/${props.providerId}/${props.program.id}`} />
          )}
        </Container>
      </div>
      {showVideo && <VideoModal onClose={() => setShowVideo(false)} url={props.program.videoEmbedUrl} />}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths:any[] = [];
  return { paths, fallback: "blocking", };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const lessonList = await ApiHelper.getAnonymous("/externalProviders/" + params.providerId + "/lessons", "LessonsApi");
    const program = ArrayHelper.getOne(lessonList.programs, "id", params.programId);

    return {
      props: { providerId: params.providerId, program, hasError: false},
      revalidate: 30,
    };
  } catch (error:any) {
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
