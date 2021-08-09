import { Redirect } from "react-router-dom";
import firebase from "firebase/app";
export default function Logout() {
  firebase.auth().signOut();
  return <Redirect to="/login" />;
}
