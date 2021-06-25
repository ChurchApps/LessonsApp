import React from "react";
import { StudyInterface, ApiHelper, Loading, Study } from ".";

interface Props {
  programId?: string,
}

export const Studies: React.FC<Props> = (props) => {
  const [studies, setStudies] = React.useState<StudyInterface[]>(null);
  const loadData = () => {
    ApiHelper.getAnonymous("/studies/program/" + props.programId, "LessonsApi").then((data: StudyInterface[]) => { setStudies(data); });
  };

  React.useEffect(loadData, []);

  const getStudies = () => {
    if (studies === null) return <Loading />
    else {
      const result: JSX.Element[] = [];
      studies.forEach(s => { result.push(<Study study={s} />) });
      return <>{result}</>;
    }
  }

  return (<>
    <br />
    <h2>Studies</h2>
    {getStudies()}
  </>);

}
