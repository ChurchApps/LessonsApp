import React from "react";
import { Switch, Route } from "react-router-dom";
import { ProgramsPage } from "./ProgramsPage";
import { ProgramPage } from "./ProgramPage";


interface Props {
    location: any;
}

export const AdminRoutes: React.FC<Props> = (props) => {
    return (
        <Switch>
            <Route path="/admin/programs/:id" component={ProgramPage}></Route>
            <Route path="/admin" component={ProgramsPage}></Route>
        </Switch>
    );
};
