import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd,
} from "@react-firebase/auth";
import { config } from "../config/config";

import { Redirect } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().languageCode = "en";

  useEffect(() => {}, []);

  function handleClick() {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        //var token = credential.accessToken;
        // The signed-in user info.
        var { uid, email, displayName, photoURL } = result.user;
        localStorage.setItem(
          "user",
          JSON.stringify({ uid, email, displayName, photoURL })
        );

        firebase.firestore().collection("users").doc(uid).set({
          uid,
          email,
          displayName,
          photoURL,
        });
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }
  return (
    <div>
      <h2>Login</h2>
      {localStorage.getItem("user") ? <Redirect to="/dashboard" /> : <br />}
      <button onClick={handleClick}>Login con Google</button>
    </div>
  );
}
