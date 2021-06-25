import React from "react";
import { Loading, Study, ProgramInterface, ProviderInterface, ApiHelper, Studies } from "./components"
import { Container } from "react-bootstrap"
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };


export const ProgramPage = ({ match }: RouteComponentProps<TParams>) => {

  const [program, setProgram] = React.useState<ProgramInterface>(null);
  const [provider, setProvider] = React.useState<ProviderInterface>(null);

  const loadData = () => {
    ApiHelper.getAnonymous("/programs/" + match.params.id, "LessonsApi").then((data: ProgramInterface) => {
      setProgram(data);
      ApiHelper.getAnonymous("/providers/" + data.providerId, "LessonsApi").then((data: any) => { setProvider(data); });
    });
  };

  React.useEffect(loadData, []);

  const getVideo = () => {
    if (program.videoEmbedUrl) return (<div className="videoWrapper">
      <iframe width="992" height="558" src={program.videoEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </div>);
  }

  const getProgram = () => {
    if (!program) return <Loading />
    else return (<>
      <div className="text-center">
        <h2>{provider?.name || ""}: <span>{program.name}</span></h2>
        <p><i>{program.shortDescription}</i></p>
      </div>
      <p>{program.description}</p>
      {getVideo()}
    </>);
  }


  return (<>
    <div className="pageSection">
      <Container>
        {getProgram()}
        <br />
        <Studies programId={match.params.id} />
      </Container>
    </div>

  </>);
}
