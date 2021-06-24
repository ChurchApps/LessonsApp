import React from "react";
import { DisplayBox, ApiHelper, LessonInterface, Loading } from "./"
import { Link } from "react-router-dom"

interface Props { studyId: string }

export const LessonList: React.FC<Props> = (props) => {
  const [lessons, setLessons] = React.useState<LessonInterface[]>(null);

  const loadData = () => {
    ApiHelper.getAnonymous("/lessons/study/" + props.studyId, "LessonsApi").then((data: any) => {
      setLessons(data);
    });
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    lessons.forEach(s => {
      result.push(<tr><td><Link to={"/admin/lessons/" + s.id}>{s.name + ": " + s.title}</Link></td></tr>);
    });
    return result;
  }

  const getTable = () => {
    //<thead><tr><th>Name</th></tr></thead>
    if (lessons === null) return <Loading />
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
    <DisplayBox headerText="Lessons" headerIcon="none">
      {getTable()}
    </DisplayBox>
  </>);
}
