import { GetStaticPaths, GetStaticProps } from "next";
import { Container, Box, Typography, Grid, Icon, Button, ButtonGroup, Tabs, Tab, styled } from "@mui/material";
import { Layout, Studies, VimeoModal } from "@/components";
import { ProgramInterface, ApiHelper, ProviderInterface, StudyInterface, StudyCategoryInterface, ArrayHelper, } from "@/utils";
import { MarkdownPreview } from "@/components"
import Error from "../_error";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import { Header } from "@/components/Header";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  program: ProgramInterface;
  provider: ProviderInterface;
  studies: StudyInterface[];
  studyCategories: StudyCategoryInterface[];
  hasError: Boolean;
  error: {
    message: string;
  };
};

export default function ProgramPage(props: Props) {
  const [filteredStudies, setFilteredStudies] = useState(props.studies);
  const [category, setCategory] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  const getCategoryList = () =>
  {
    const categories = ArrayHelper.getUniqueValues(props.studyCategories, "categoryName").sort();
    const tabs:JSX.Element[] = [];
    categories.forEach((name) => { tabs.push(<Tab label={name} value={name} key={name} />)});
    return (<Tabs
      id="studyCategoryTabs"
      value={category}
      onChange={(e, newValue) => setCategory(newValue)}
      TabIndicatorProps={{style: {background:"transparent"}}}
    >
      <Tab value="" label="All" />
      {tabs}
    </Tabs>);
  }

  useEffect(() => {
    if (category==="") setFilteredStudies(props.studies);
    else {
      const filteredCategories = props.studyCategories.filter((sc) => sc.categoryName === category).sort((a, b) => a.sort - b.sort);
      let result:StudyInterface[] = [];
      filteredCategories.forEach((sc) => {
        const study = ArrayHelper.getOne(props.studies, "id", sc.studyId);
        if (study) result.push(study);
        setFilteredStudies(result)
      });
    }
  }, [category]);

  if (props.hasError) {
    return <Error message={props.error.message} />
  }

  const video = props.program.videoEmbedUrl && (<EmbeddedVideo videoEmbedUrl={props.program.videoEmbedUrl} title={props.program.name} />);

  return (
    <Layout pageTitle={props.program.name + " - Free Church Curriculum"} metaDescription={props.program.description} image={props.program.image} withoutNavbar>
      <div id="programHero" style={{ backgroundImage:"url('/images/programs/" + props.program.slug + ".jpg')" }}>
        <div className="content">
          <Container fixed>
            <Header position="static" />
            <h1>{props.program.name}</h1>
            <div style={{marginBottom:20}}>{props.program.shortDescription}</div>
            {video && <a href="about:blank" onClick={(e) => { e.preventDefault(); setShowVideo(true); }} className="cta"><Icon style={{float:"left", marginRight:10}}>play_circle</Icon>Watch Trailer</a>}
            <div style={{height:90}}></div>
            <Image src={props.program.image} alt={props.program.name} width={320} height={180} className="badge" />
          </Container>
        </div>
      </div>
      <div className="pageSection">
        <Container fixed>
          <div id="programIntro">
            <h2>Studies</h2>
            <div><MarkdownPreview value={props.program.description} /></div>
          </div>

          {getCategoryList()}
          {props.studies?.length > 0 && (
            <Studies studies={filteredStudies} slug={`/${props.program.slug}`} />
          )}
        </Container>
      </div>
      {showVideo && <VimeoModal onClose={() => setShowVideo(false)} vimeoId={props.program.videoEmbedUrl} />}
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
    const studyCategories: StudyCategoryInterface[] = await ApiHelper.getAnonymous("/studyCategories/public/program/" + program?.id, "LessonsApi");

    return {
      props: { program, provider, studies, studyCategories, hasError: false},
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
