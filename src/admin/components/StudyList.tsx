import React from "react";
import { DisplayBox, ApiHelper, StudyInterface, Loading } from "./"
import { Link } from "react-router-dom"

interface Props { programId: string }

export const StudyList: React.FC<Props> = (props) => {
  const [studies, setStudies] = React.useState<StudyInterface[]>(null);

  const loadData = () => {
    ApiHelper.get("/studies/program/" + props.programId, "LessonsApi").then((data: any) => {
      setStudies(data);
    });
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    studies.forEach(s => {
      result.push(<tr>
        <td className="imgCol"><img src={s.image || "/images/blank.png"} className="img-fluid" alt="study" /></td>
        <td><Link to={"/admin/studies/" + s.id}>{s.name}</Link></td>
      </tr>);
    });
    return result;
  }

  const getTable = () => {
    //<thead><tr><th>Name</th></tr></thead>
    if (studies === null) return <Loading />
    else return (
      <table className="table">
        <tbody>
          {getRows()}
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
