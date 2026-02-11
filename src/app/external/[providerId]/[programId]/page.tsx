"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Icon } from "@mui/material";
import { MarkdownPreviewLight } from "@churchapps/apphelper-markdown";
import { Layout, Studies, VideoModal } from "@/components";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import { Header } from "@/components/Header";
import { ApiHelper, ArrayHelper, ProgramInterface } from "@/helpers";

type PageParams = { providerId: string; programId: string };

export default function ProgramPage() {
  const params = useParams<PageParams>();
  const [filteredStudies, setFilteredStudies] = useState([]);
  const [category, _setCategory] = useState("");
  const [program, setProgram] = useState<ProgramInterface>(null);
  const [showVideo, setShowVideo] = useState(false);

  const loadData = async () => {
    const lessonList = await ApiHelper.getAnonymous("/externalProviders/" + params.providerId + "/lessons", "LessonsApi");
    const program = ArrayHelper.getOne(lessonList.programs, "id", params.programId);
    setProgram(program);
    setFilteredStudies(program.studies);
  };

  useEffect(() => {
    loadData();
  }, [category]);

  const video = program.videoEmbedUrl && <EmbeddedVideo videoEmbedUrl={program.videoEmbedUrl} title={program.name} />;

  if (!program) return <></>;
  return (
    <Layout
      pageTitle={program.name + " - Free Church Curriculum"}
      metaDescription={program.description}
      image={program.image}
      withoutNavbar>
      <div id="studyHero">
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <h1>{program.name}</h1>
            <div style={{ marginBottom: 20 }}>{program.shortDescription}</div>
            {video && (
              <a
                href="about:blank"
                onClick={e => {
                  e.preventDefault();
                  setShowVideo(true);
                }}
                className="cta">
                <Icon style={{ float: "left", marginRight: 10 }}>play_circle</Icon>Watch Trailer
              </a>
            )}
            <div style={{ height: 90 }}></div>
            <Image src={program.image || "/not-found"} alt={program.name} width={320} height={180} className="badge" />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="programIntro">
            <h2>Studies</h2>
            <div>
              <MarkdownPreviewLight value={program.description} />
            </div>
          </div>

          {filteredStudies?.length > 0 && (
            <Studies studies={filteredStudies} slug={`/external/${params.providerId}/${program.id}`} />
          )}
        </Container>
      </div>
      {showVideo && <VideoModal onClose={() => setShowVideo(false)} url={program.videoEmbedUrl} />}
    </Layout>
  );
}
