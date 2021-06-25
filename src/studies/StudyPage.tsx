import React from "react";
import { Loading, ProgramInterface, StudyInterface, ApiHelper, Lesson } from "./components"
import { Container } from "react-bootstrap"
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

        <h2>Lessons</h2>

        <Lesson videoId="b_C1a_SOMWU" title="Power Up Week 1" description="When Ethel and Rusty unleash a giant chocolate bunny on the lab, they quickly realize why it's a good idea to obey. Check out this special Easter episode of The Adventures of Herman and Rusty." />
        <Lesson videoId="tQB0qhw4j4I" title="Power Up Week 2" description="When Ethel's video goes viral, Skip convinces her to abandon her friends and live a celebrity life. It's up to Herman and Hannah to help her choose the humble attitude." />
        <Lesson videoId="vKTg0io5RGs" title="Power Up Week 3" description="Rusty refuses to stop playing  Fornite, even though the lab is in danger of blowing up." />
        <Lesson videoId="0xird8Ucvnw" title="Power Up Week 4" description="Herman is hosting game night at the lab, but things go awry when temptation gets the best of Rusty." />

      </Container>
    </div>
  );
}
