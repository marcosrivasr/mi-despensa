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
import { useEffect, useState } from "react";

import { DataState } from "../types/dataState";

export default function Dashboard() {
  const [isUserSigned, setIsUserSigned] = useState<DataState>(DataState.None);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
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
  });

  function getDisplayName() {
    return (
      <div>
        <p>
          <img src={currentUser?.photoURL} alt="" />
        </p>
        {currentUser?.displayName}
      </div>
    );
  }

  function getDataCollections() {
    return (
      <FirestoreProvider {...config} firebase={firebase}>
        <FirestoreCollection path="/shopping_lists/">
          {(d) => {
            return d.isLoading
              ? "Loading"
              : d.value.map((item) => {
                  return (
                    <div>
                      {item.title} <button>Editar lista</button>
                      <button>Eliminar lista</button>
                    </div>
                  );
                });
          }}
        </FirestoreCollection>
      </FirestoreProvider>
    );
  }

  function UserLoggedIn() {
    return (
      <>
        <h1>{getDisplayName()}</h1>
        <button>Crear nueva lista</button>
      </>
    );
  }

  function UserNotLoggedIn() {
    return <Redirect to="/home" />;
  }

  function renderUI() {
    switch (isUserSigned) {
      case DataState.Completed:
        return <UserLoggedIn />;
      case DataState.Error:
        return <UserLoggedIn />;
    }
  }

  return (
    <div>
      {renderUI()}
      {getDataCollections()}
    </div>
  );
}
