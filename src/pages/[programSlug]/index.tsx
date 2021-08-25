import { GetStaticPaths, GetStaticProps } from "next";
import { Container } from "react-bootstrap";
import { Layout, Studies } from "@/components";
import ReactMarkdown from "react-markdown";

import {
  ProgramInterface,
  ApiHelper,
  ProviderInterface,
  StudyInterface,
} from "@/utils";

type Props = {
  program: ProgramInterface;
  provider: ProviderInterface;
  studies: StudyInterface[];
};

export default function ProgramPage({ program, provider, studies }: Props) {
  const video = program.videoEmbedUrl && (
    <div className="videoWrapper">
      <iframe
        width="992"
        height="558"
        src={program.videoEmbedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );

  return (
    <Layout>
      <div className="pageSection">
        <Container>
          <div className="text-center">
            <h2>
              {provider?.name || ""}: <span>{program.name}</span>
            </h2>
            <p>
              <i>{program.shortDescription}</i>
            </p>
          </div>
          <p><ReactMarkdown>{program.description}</ReactMarkdown></p>
          {video}
          <br />
          <br />
          {studies?.length > 0 && (
            <Studies studies={studies} slug={`/${program.slug}`} />
          )}
        </Container>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const programs: ProgramInterface[] = await ApiHelper.getAnonymous(
    "/programs/public",
    "LessonsApi"
  );

  const paths = programs
    .filter((p) => p.slug)
    .map((p) => ({ params: { programSlug: p.slug } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const program: ProgramInterface = await ApiHelper.getAnonymous(
    "/programs/public/slug/" + params.programSlug,
    "LessonsApi"
  );

  const provider: ProviderInterface = await ApiHelper.getAnonymous(
    "/providers/public/" + program.providerId,
    "LessonsApi"
  );

  const studies: StudyInterface[] = await ApiHelper.getAnonymous(
    "/studies/public/program/" + program.id,
    "LessonsApi"
  );

  return {
    props: {
      program,
      provider,
      studies,
    },
    revalidate: 30,
  };
};
