import React from "react";
import { DisplayBox, ApiHelper, Loading, ProgramInterface } from "./components"
import { Link } from "react-router-dom"


export const ProgramsPage = () => {
  const [programs, setPrograms] = React.useState<ProgramInterface[]>(null);

  const loadData = () => {
    ApiHelper.getAnonymous("/programs/provider/1", "LessonsApi").then((data: any) => {
      setPrograms(data);
    });
  };

  React.useEffect(loadData, []);

  const getRows = () => {
    const result: JSX.Element[] = [];
    programs.forEach(p => {
      result.push(<tr><td><Link to={"/admin/programs/" + p.id}>{p.name}</Link></td></tr>);
    });
    return result;
  }

  const getTable = () => {
    if (programs === null) return <Loading />
    else return (
      <table className="table">
        <thead><tr><th>Name</th></tr></thead>
        <tbody>
          {getRows()}
        </tbody>
      </table>
    )
  }

  return (<>
    <h1>Programs</h1>
    <DisplayBox headerText="Programs" headerIcon="none" >
      {getTable()}
    </DisplayBox>
  </>);
}
