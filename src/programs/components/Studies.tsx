import React from "react";
import { StudyInterface, ApiHelper, Loading, Study } from ".";
import { ProgramInterface } from "../../helpers";

interface Props {
  program?: ProgramInterface,
}

export const Studies: React.FC<Props> = (props) => {
  const [studies, setStudies] = React.useState<StudyInterface[]>(null);
  const loadData = () => {
    if (props.program) ApiHelper.getAnonymous("/studies/public/program/" + props.program?.id, "LessonsApi").then((data: StudyInterface[]) => { setStudies(data); });
  };

  React.useEffect(loadData, [props.program]);

  const getStudies = () => {
    if (studies === null) return <Loading />
    else {
      const result: JSX.Element[] = [];
      studies.forEach(s => { result.push(<Study program={props.program} study={s} />) });
      return <>{result}</>;
    }
  }

  return (<>
    <br />
    <h2>Studies</h2>
    {getStudies()}
  </>);

}
