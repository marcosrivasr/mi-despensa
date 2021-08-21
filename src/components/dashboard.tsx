import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { IfFirebaseAuthedAnd } from "@react-firebase/auth";
import { Redirect, Link } from "react-router-dom";
import { config } from "../config/config";
import { useEffect, useState, lazy, Suspense } from "react";

import { DataState } from "../types/dataState";
import PrimaryButton from "../ui-framework/primaryButton";
import SquareItem from "./squareItem";

const NewListView = lazy(() => import("./newListView"));

export default function Dashboard() {
  const [isUserSigned, setIsUserSigned] = useState<DataState>(DataState.None);
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewListView, setshowNewListView] = useState(false);
  const db = firebase.firestore();
  const auth = firebase.auth();

  const [lists, setLists] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setCurrentUser(user);
        setIsUserSigned(DataState.Completed);

        db.collection("shopping_lists")
          .where("ownerid", "==", user.uid)
          .get()
          .then((data) => {
            let dataLists = [];
            data.forEach((item) => {
              dataLists.push(item.data());
            });
            setLists(dataLists);
          });
      } else {
        setIsUserSigned(DataState.Error);
        // User is signed out
        // ...
      }
    });
  }, []);

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
    return <div>Lista</div>;
  }

  function onHandleShouldCloseViewPane(state) {
    setshowNewListView(state);
  }

  return (
    <div>
      <div className="dashboard-header">
        <PrimaryButton
          onClick={() => setshowNewListView(true)}
          value="Crear una nueva lista"
        />
      </div>
      <div
        className="lists-container"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          paddingTop: "10px",
        }}
      >
        {lists.map((list) => {
          return (
            <Link to={`/list/${list.id}`} style={{ textDecoration: "none" }}>
              <SquareItem key={list.id} text={list.title} emoji={list.icon} />
            </Link>
          );
        })}
      </div>

      {showNewListView ? (
        <Suspense fallback={<div>Loading...</div>}>
          <NewListView shouldCloseViewPane={onHandleShouldCloseViewPane} />
        </Suspense>
      ) : (
        ""
      )}
    </div>
  );
}
