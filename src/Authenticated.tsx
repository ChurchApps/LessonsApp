import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Header, UserHelper } from "./components";
import { AdminRoutes } from "./admin/AdminRoutes";
// import UserContext from "./UserContext";


interface Props {
  location: any;
}

export const Authenticated: React.FC<Props> = (props) => {



  if (UserHelper.churchChanged) {
    UserHelper.churchChanged = false;
    return <Redirect to="/people" />
  }
  else return (
    <>
      <link rel="stylesheet" href="/css/cp.css" />
      <Header></Header>
      <div className="container">
        <Switch>
          <Route path="/login"><Redirect to={props.location} /></Route>
          <Route path="/people"><p>Hi</p></Route>
          <Route path="/admin"><AdminRoutes location={props.location} /></Route>
        </Switch>
      </div>
      <iframe title="print" style={{ display: "none" }} src="about:blank" id="printFrame"></iframe>
      <script src="/js/cp.js"></script>
    </>
  );


};


