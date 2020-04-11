import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  Login,
  Home,
  PatientDataForm,
  NoMatch
} from "./screens";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <PrivateRoute path="/" exact>
          <Home />
        </PrivateRoute>
        <PrivateRoute path="/patient-data" exact>
          <PatientDataForm />
        </PrivateRoute>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
