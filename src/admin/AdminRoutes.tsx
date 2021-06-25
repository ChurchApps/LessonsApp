import React from "react";
import { Switch, Route } from "react-router-dom";
import { AdminPage } from "./AdminPage";


interface Props {
  location: any;
}

//      <Route path="/admin/lessons/:id" component={LessonPage}></Route>

export const AdminRoutes: React.FC<Props> = (props) => {
  return (
    <Switch>
      <Route path="/admin" component={AdminPage}></Route>
    </Switch>
  );
};
