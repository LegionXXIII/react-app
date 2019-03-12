import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Movies from "./components/movies";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NavBar from "./components/navbar";
import NotFound from "./components/notFound";

class App extends Component {
  render() {
    return (
      <main className="container">
        <NavBar />
        <Switch>
          <Route path="/movies" component={Movies} />
          <Route path="/customers" component={Customers} />
          <Route path="/rentals" component={Rentals} />
          <Route path="/" exact component={Movies} />
          <Route path="/" component={NotFound} />
        </Switch>
      </main>
    );
  }
}

export default App;
