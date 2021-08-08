import Home from "./components/home";
import Dashboard from "./components/dashboard";
import { BrowserRouter, Route, Switch } from "react-router-dom";

export const App = () => {
  return (
    <div>
      <h1>Mi despensa</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};
