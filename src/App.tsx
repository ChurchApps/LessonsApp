import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Routes } from "./Routes";
import { UserProvider } from "./UserContext";
import { CookiesProvider } from "react-cookie";
import { ScrollToTop } from "./components";

const App: React.FC = () => (
  <UserProvider>
    <CookiesProvider>
      <Router>
        <ScrollToTop />
        <Switch>
          <Route path="/"><Routes /></Route>
        </Switch>
      </Router>
    </CookiesProvider>
  </UserProvider>
)
export default App;

