import React from "react";
import { ApiHelper, Loading, Lesson, LessonInterface } from ".";

interface Props {
  studyId?: string,
}

export const Lessons: React.FC<Props> = (props) => {
  const [lessons, setLessons] = React.useState<LessonInterface[]>(null);
  const loadData = () => {
    if (props.studyId) ApiHelper.getAnonymous("/lessons/public/study/" + props.studyId, "LessonsApi").then((data: LessonInterface[]) => { setLessons(data); });
  };

  React.useEffect(loadData, [props.studyId]);

  const getLessons = () => {
    if (lessons === null) return <Loading />
    else {
      const result: JSX.Element[] = [];
      lessons.forEach(l => { result.push(<Lesson lesson={l} />) });
      return <>{result}</>;
    }
  }

  return (<>
    <br />
    <h2>Lessons</h2>
    {getLessons()}
  </>);

}
