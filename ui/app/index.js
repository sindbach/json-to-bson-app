import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={MainContainer} />
        </Switch>
      </Router>
    )
  }
}

render(<App />, document.getElementById("root"));
