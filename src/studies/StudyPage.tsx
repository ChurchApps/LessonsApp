import React from "react";
import { Loading, ProgramInterface, StudyInterface, ApiHelper, Lessons } from "./components"
import { Container, Row, Col } from "react-bootstrap"
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };


export const StudyPage = ({ match }: RouteComponentProps<TParams>) => {

  const [program, setProgram] = React.useState<ProgramInterface>(null);
  const [study, setStudy] = React.useState<StudyInterface>(null);

  const loadData = () => {
    ApiHelper.getAnonymous("/studies/" + match.params.id, "LessonsApi").then((data: StudyInterface) => {
      setStudy(data);
      ApiHelper.getAnonymous("/programs/" + data.programId, "LessonsApi").then((data: ProgramInterface) => { setProgram(data); });
    });
  };

  React.useEffect(loadData, []);


  const getVideo = () => {
    if (study.videoEmbedUrl) return (<div className="videoWrapper">
      <iframe width="992" height="558" src={study.videoEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </div>);
    else return <Row><Col lg={{ span: 8, offset: 2 }} ><img src={study.image} className="img-fluid profilePic" alt={study.name} /><br /><br /></Col></Row >
  }

  const getStudy = () => {
    if (!program) return <Loading />
    else return (<>
      <div className="text-center">
        <h2>{program?.name || ""}: <span>{study.name}</span></h2>
        <p><i>{study.shortDescription}</i></p>
      </div>
      <p>{study.description}</p>
      {getVideo()}
    </>);
  }



  return (
    <div className="pageSection">
      <Container>
        {getStudy()}
        <Lessons studyId={study?.id} />
      </Container>
    </div>
  );
}
