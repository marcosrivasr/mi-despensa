import Home from "./components/home";
import Dashboard from "./components/dashboard";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/login";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { FirebaseAuthProvider } from "@react-firebase/auth";
import { config } from "./config/config";
import Header from "./components/header";
import { headerDataItems } from "./data/headerItems";
import Logout from "./components/logout";
import Nickname from "./components/nickname";
import {
  FirestoreProvider,
  FirestoreDocument,
} from "@react-firebase/firestore";
import ListView from "./components/listView";

export const App = () => {
  return (
    <div>
      <FirebaseAuthProvider {...config} firebase={firebase}>
        <BrowserRouter>
          <Header {...headerDataItems} />
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/nickname">
              <Nickname />
            </Route>
            <Route path="/list/:id" component={ListView}></Route>
          </Switch>
        </BrowserRouter>
      </FirebaseAuthProvider>
    </div>
  );
};
