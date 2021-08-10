import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { Redirect } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [redirectNickname, setRedirectNickName] = useState(0);

  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().languageCode = "en";

  async function handleClick() {
    try {
      const result = await firebase.auth().signInWithPopup(provider);

      /** @type {firebase.auth.OAuthCredential} 
      var credential = result.credential;*/

      // This gives you a Google Access Token. You can use it to access the Google API.
      //var token = credential.accessToken;
      // The signed-in user info.

      //obtenemos el usuario registrado
      const response = await firebase
        .firestore()
        .collection("users")
        .doc(result.user.uid)
        .get();

      if (response.exists) {
        console.log("El usuario está registrado");
        setRedirectNickName(1);
      } else {
        console.log("El usuario NO está registrado");
        setRedirectNickName(2);
      }
    } catch (error) {
      // Handle Errors here.
      console.error(error.code, error.message, error.email, error.credential);
    }
  }

  function renderUI() {
    switch (redirectNickname) {
      case 1:
        return <Redirect to="/dashboard" />;
      case 2:
        return <Redirect to="/nickname" />;
    }
  }

  return (
    <div>
      <h2>Login {redirectNickname.toString()}</h2>
      {renderUI()}
      <button onClick={handleClick}>Login con Google</button>
    </div>
  );
}
