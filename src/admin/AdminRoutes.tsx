import React from "react";
import { Switch, Route } from "react-router-dom";
import { ProgramsPage } from "./ProgramsPage";
import { ProgramPage } from "./ProgramPage";
import { StudyPage } from "./StudyPage";
import { LessonPage } from "./LessonPage";


interface Props {
  location: any;
}

export const AdminRoutes: React.FC<Props> = (props) => {
  return (
    <Switch>
      <Route path="/admin/programs/:id" component={ProgramPage}></Route>
      <Route path="/admin/studies/:id" component={StudyPage}></Route>
      <Route path="/admin/lessons/:id" component={LessonPage}></Route>
      <Route path="/admin" component={ProgramsPage}></Route>
    </Switch>
  );
};
