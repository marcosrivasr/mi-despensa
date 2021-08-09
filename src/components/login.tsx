import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd,
} from "@react-firebase/auth";
import { config } from "../config/config";

import { Redirect } from "react-router-dom";

export default function Login() {
  return (
    <div>
      <h2>Login</h2>
      <Link to="/home">Home</Link> {}
      <Link to="/dashboard">Dashboard</Link>
      <FirebaseAuthProvider {...config} firebase={firebase}>
        <button
          onClick={() => {
            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(googleAuthProvider);
          }}
        >
          Sign In with Google
        </button>

        <button
          onClick={() => {
            const facebookAuthProvider =
              new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithPopup(facebookAuthProvider);
          }}
        >
          Sign In with Facebook
        </button>

        <FirebaseAuthConsumer>
          {({ isSignedIn, user, providerId }) => {
            return (
              <pre style={{ height: 300, overflow: "auto" }}>
                {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
              </pre>
            );
          }}
        </FirebaseAuthConsumer>
        <div>
          <IfFirebaseAuthed>
            {() => {
              return <Redirect to="/dashboard" />;
            }}
          </IfFirebaseAuthed>

          <IfFirebaseAuthedAnd
            filter={({ providerId }) => providerId !== "anonymous"}
          >
            {({ providerId }) => {
              return <div>You are authenticated with {providerId}</div>;
            }}
          </IfFirebaseAuthedAnd>
        </div>
      </FirebaseAuthProvider>
    </div>
  );
}
