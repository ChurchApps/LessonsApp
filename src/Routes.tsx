import React from "react";
import UserContext from "./UserContext";

import { ApiHelper } from "./components";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { Forgot } from "./Forgot";
import { Login } from "./Login";
import { Home } from "./Home"
import { StudyPage } from "./studies/StudyPage"
import { ProgramPage } from "./programs/ProgramPage"
import { LessonPage } from "./lessons/LessonPage"

import { Authenticated } from "./Authenticated";
import { Logout } from "./Logout";
import ReactGA from "react-ga";
import { EnvironmentHelper } from "./helpers";
import { Header, Footer } from "./components";


interface Props { path?: string; }

export const Routes = () => {

  const location = useLocation();
  if (EnvironmentHelper.GoogleAnalyticsTag !== "") {
    ReactGA.initialize(EnvironmentHelper.GoogleAnalyticsTag);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  React.useEffect(() => { if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.pageview(location.pathname + location.search); }, [location]);


  let user = React.useContext(UserContext).userName; //to force rerender on login
  if (user === null) return null;
  return (
    <>
      <link rel="stylesheet" href="/css/cp.css" />
      <Header />

      <Switch>
        <Route exact={true} path="/"><Home /></Route>
        <Route path="/logout"><Logout /></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/forgot"><Forgot /></Route>
        <PrivateRoute path="/"></PrivateRoute>
        <Route path="/:programSlug/:studySlug/:lessonSlug" component={LessonPage}></Route>
        <Route path="/:programSlug/:studySlug" component={StudyPage}></Route>
        <Route path="/:programSlug/" component={ProgramPage}></Route>

      </Switch>
      <Footer />
      <iframe title="print" style={{ display: "none" }} src="about:blank" id="printFrame"></iframe>
    </>
  );
};

const PrivateRoute: React.FC<Props> = ({ path }) => (
  <Route
    path={path}
    render={({ location }) => (ApiHelper.isAuthenticated)
      ? (<Authenticated location={location.pathname}></Authenticated>)
      : (<Redirect to={{ pathname: "/login", state: { from: location } }}></Redirect>)}
  ></Route>
);
