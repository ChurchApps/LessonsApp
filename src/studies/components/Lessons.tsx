import React from "react";
import { ApiHelper, Loading, Lesson, LessonInterface, ProgramInterface, StudyInterface } from ".";

interface Props {
  study: StudyInterface,
  program: ProgramInterface
}

export const Lessons: React.FC<Props> = (props) => {
  const [lessons, setLessons] = React.useState<LessonInterface[]>(null);
  const loadData = () => {
    if (props.study && props.program) ApiHelper.getAnonymous("/lessons/public/study/" + props.study.id, "LessonsApi").then((data: LessonInterface[]) => { setLessons(data); });
  };

  React.useEffect(loadData, [props.study, props.program]);

  const getLessons = () => {
    if (lessons === null) return <Loading />
    else {
      const result: JSX.Element[] = [];
      lessons.forEach(l => { result.push(<Lesson lesson={l} study={props.study} program={props.program} />) });
      return <>{result}</>;
    }
  }

  return (<>
    <br />
    <h2>Lessons</h2>
    {getLessons()}
  </>);

}
