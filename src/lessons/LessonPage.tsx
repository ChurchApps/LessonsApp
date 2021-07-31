import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { LessonInterface, StudyInterface, ProgramInterface, ApiHelper, Loading, Venues, AboutProgram } from "./components";
import { Container, Row, Col } from "react-bootstrap"

type TParams = { programSlug: string, studySlug: string, lessonSlug: string };

export const LessonPage = ({ match }: RouteComponentProps<TParams>) => {

  const [program, setProgram] = React.useState<ProgramInterface>(null);
  const [study, setStudy] = React.useState<StudyInterface>(null);
  const [lesson, setLesson] = React.useState<LessonInterface>(null);

  const loadData = async () => {
    ApiHelper.getAnonymous("/lessons/public/slug/" + match.params.lessonSlug, "LessonsApi").then((data: LessonInterface) => { setLesson(data); });
    ApiHelper.getAnonymous("/studies/public/slug/" + match.params.studySlug, "LessonsApi").then((data: StudyInterface) => { setStudy(data); });
    ApiHelper.getAnonymous("/programs/public/slug/" + match.params.programSlug, "LessonsApi").then((data: ProgramInterface) => { setProgram(data); });
  };

  const checkLoadData = () => {
    loadData();
  }

  React.useEffect(checkLoadData, []);


  const getLesson = () => {
    if (!lesson) return <Loading />
    else return (<>
      <div className="text-center">
        <div className="title">{program?.name}: <span>{study?.name}</span></div>
        <h2>{lesson?.name}: <span>{lesson?.title}</span></h2>
      </div>
      {getVideo()}
      <p>{lesson?.description}</p>

    </>);
  }


  const getVideo = () => {
    if (lesson?.videoEmbedUrl) return (<div className="videoWrapper">
      <iframe width="992" height="558" src={lesson?.videoEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </div>);
    else return <Row><Col lg={{ span: 8, offset: 2 }} ><img src={lesson.image} className="img-fluid profilePic" alt={lesson.name} /><br /><br /></Col></Row >
  }


  return (
    <div className="pageSection">
      <Container>
        {getLesson()}

        <Venues lessonId={lesson?.id || ""} />
        <AboutProgram program={program} />
      </Container>
    </div>
  );
}
