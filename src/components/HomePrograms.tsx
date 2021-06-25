import React from "react";
import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom";
import { Loading, ApiHelper, ProgramInterface, ProviderInterface } from "."


export const HomePrograms = () => {

  const [programs, setPrograms] = React.useState<ProgramInterface[]>(null);
  const [providers, setProviders] = React.useState<ProviderInterface[]>(null);

  const loadData = () => {
    ApiHelper.getAnonymous("/programs", "LessonsApi").then((data: any) => { setPrograms(data); });
    ApiHelper.getAnonymous("/providers/public", "LessonsApi").then((data: any) => { setProviders(data); });
  };

  React.useEffect(loadData, []);

  const getProgram = (p: ProgramInterface) => {
    return (<>
      <Row>
        <Col xl={4}>
          <Link to={"/programs/" + p.id}><img src={p.image} className="img-fluid" alt={p.name} /></Link>
        </Col>
        <Col xl={8}>
          <Link to={"/programs/" + p.id}><h3>{p.name}</h3></Link>
          <p><i>{p.shortDescription}</i></p>
          <p>{p.description}</p>
        </Col>
      </Row>
      <hr />
    </>);
  }


  const getProvider = (provider: ProviderInterface) => {
    const result: JSX.Element[] = [];
    programs.forEach(p => { if (p.providerId === provider.id) result.push(getProgram(p)) });
    return (<>
      <h3>{provider.name}</h3>
      {result}
    </>);
  }

  const getPrograms = () => {
    if (programs === null || providers === null) return <Loading />
    else {
      const result: JSX.Element[] = [];
      providers.forEach(p => { result.push(getProvider(p)) });
      return result;
    }
  }

  return (<>
    <div className="homeSection">
      <Container>
        <h2 className="text-center">Browse <span>Available Programs</span></h2>
        {getPrograms()}
      </Container>
    </div>
  </>);
}
