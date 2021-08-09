import "firebase/auth";
import "firebase/firestore";
import { IfFirebaseAuthedAnd } from "@react-firebase/auth";
import { Redirect } from "react-router-dom";

import {
  FirestoreProvider,
  FirestoreDocument,
  FirestoreCollection,
} from "@react-firebase/firestore";
import { config } from "../config/config";
import firebase from "firebase/app";
import { useState } from "react";

import { DataState } from "../types/dataState";

export default function Dashboard() {
  const [isUserSigned, setIsUserSigned] = useState<DataState>(DataState.None);
  const [currentUser, setCurrentUser] = useState(null);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      setCurrentUser(user);
      setIsUserSigned(DataState.Completed);
      // ...
    } else {
      setIsUserSigned(DataState.Error);
      // User is signed out
      // ...
    }
  });

  function getDisplayName() {
    return (
      <span>
        {currentUser?.displayName} <img src={currentUser?.photoURL} />
      </span>
    );
  }

  function getDataCollections() {
    return (
      <FirestoreProvider {...config} firebase={firebase}>
        <FirestoreCollection path="/users/">
          {(d) => {
            return d.isLoading
              ? "Loading"
              : d.value.map((item) => {
                  return <div>{item.displayName}</div>;
                });
          }}
        </FirestoreCollection>
      </FirestoreProvider>
    );
  }

  function UserLoggedIn() {
    return <div>Logueado</div>;
  }

  function UserNotLoggedIn() {
    return <Redirect to="/home" />;
  }

  return (
    <div>
      {isUserSigned === DataState.Completed ? (
        <UserLoggedIn />
      ) : isUserSigned === DataState.Error ? (
        <UserNotLoggedIn />
      ) : (
        ""
      )}

      <h1>{getDisplayName()}</h1>
      {getDataCollections()}
    </div>
  );
}
