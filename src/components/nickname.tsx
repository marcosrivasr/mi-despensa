import { useState } from "react";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { DataState } from "../types/dataState";
import { Redirect } from "react-router";

export default function Nickname() {
  const [username, setUsername] = useState<string>(null);
  const [user, setUser] = useState<firebase.User>(null);
  const [isUserSigned, setIsUserSigned] = useState<DataState>(DataState.None);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setIsUserSigned(DataState.Loading);
      setUser(user);
      // ...
    } else {
      setIsUserSigned(DataState.Error);
      // User is signed out
      // ...
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (username || username.trim() !== "") {
      const { uid, displayName, email, photoURL } = user;
      const response = firebase.firestore().collection("users").doc(uid).set({
        username,
        uid,
        displayName,
        email,
        photoURL,
      });

      setIsUserSigned(DataState.Completed);
    }
  }

  function handleChange(e) {
    setUsername(e.target.value);
  }

  function GetUsernameForm() {
    return (
      <>
        <h2>Selecciona un nombre de usuario</h2>
        <form onSubmit={handleSubmit}>
          <input onChange={handleChange} />
          <input type="submit" value="Confirmar" />
        </form>
      </>
    );
  }

  function RedirectToComplete() {
    return <Redirect to="/dashboard" />;
  }

  return isUserSigned === DataState.Loading ? (
    <GetUsernameForm />
  ) : isUserSigned === DataState.Completed ? (
    <RedirectToComplete />
  ) : (
    <Redirect to="/login" />
  );
}
