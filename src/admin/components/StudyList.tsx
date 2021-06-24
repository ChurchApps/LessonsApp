import React from "react";
import { DisplayBox, ApiHelper, StudyInterface, Loading } from "./"
import { Link } from "react-router-dom"
import { RouteComponentProps } from "react-router-dom";

interface Props { programId: string }

export const StudyList: React.FC<Props> = (props) => {
  const [studies, setStudies] = React.useState<StudyInterface[]>(null);

  const loadData = () => {
    ApiHelper.getAnonymous("/studies/program/" + props.programId, "LessonsApi").then((data: any) => {
      setStudies(data);
    });
  };

  const getTable = () => {
    //<thead><tr><th>Name</th></tr></thead>
    if (studies === null) return <Loading />
    else return (
      <table className="table">

        <tbody>
          <tr><td><Link to="/admin/programs/1">High Voltage Elementary</Link></td></tr>
        </tbody>
      </table>
    )
  }

  React.useEffect(loadData, []);

  return (<>
    <DisplayBox headerText="Studies" headerIcon="none">
      {getTable()}
    </DisplayBox>
  </>);
}
