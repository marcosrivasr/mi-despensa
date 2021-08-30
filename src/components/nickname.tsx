import { useEffect, useState } from "react";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { LoginState } from "../types/dataState";
import { Redirect } from "react-router";
import "./nickname.scss";

export default function Nickname() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loginProcess, setLoginProcess] = useState(LoginState.None);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("hay usuario");
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        //setIsUserSigned(DataState.Loading);
        setUser(user);
        // ...
      } else {
        //setIsUserSigned(DataState.Error);
      }
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || username.trim() === "") {
      return;
    }

    const usernameExists = await firebase
      .firestore()
      .collection("users")
      .where("username", "==", username)
      .get();

    if (usernameExists.empty) {
      setLoginProcess(LoginState.UsernameAvailable);
    } else {
      setLoginProcess(LoginState.UsernameTaken);
    }
  }

  async function handleCompleteProcess() {
    const { uid, displayName, email, photoURL } = user;
    await firebase.firestore().collection("users").doc(uid).set({
      username,
      uid,
      displayName,
      email,
      photoURL,
    });
    setLoginProcess(LoginState.LoginCompleted);
  }

  function getUsernameForm() {
    return (
      <div className="nickname">
        <h2>Selecciona un nombre de usuario</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
          />
          <input type="submit" value="Validar" />
          <div>
            {loginProcess === LoginState.UsernameAvailable
              ? "El nombre de usuario está disponible!"
              : ""}
            {loginProcess === LoginState.UsernameTaken
              ? "Escoge otro nombre de usuario, ya existe ese usuario"
              : ""}

            {loginProcess === LoginState.LoginCompleted ? "Bienvenido" : ""}

            {loginProcess === LoginState.UsernameAvailable ? (
              <div>
                <button onClick={handleCompleteProcess}>
                  Terminar registro
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      {getUsernameForm()}
      {loginProcess === LoginState.LoginCompleted ? (
        <Redirect to="/dashboard" />
      ) : (
        ""
      )}
    </>
  );
}
