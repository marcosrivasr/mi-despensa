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
import { getListsInvited, getListsOwned } from "../services/firestoreService";

import "./listsView.scss";

const NewListView = lazy(() => import("./newListView"));

export default function Dashboard() {
  const [isUserSigned, setIsUserSigned] = useState<DataState>(DataState.None);
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewListView, setshowNewListView] = useState(false);
  const db = firebase.firestore();
  const auth = firebase.auth();

  const [lists, setLists] = useState([]);
  const [listsInvited, setListsInvited] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setCurrentUser(user);
        setIsUserSigned(DataState.Completed);

        const listsInvited = await getListsInvited(user.uid);
        setListsInvited(listsInvited);

        const listsOwned = await getListsOwned(user.uid);
        setLists(listsOwned);
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
      <div className="listsContainer">
        {lists.map((list) => {
          return (
            <Link to={`/list/${list.id}`} style={{ textDecoration: "none" }}>
              <SquareItem key={list.id} item={list} />
            </Link>
          );
        })}
      </div>

      <div className="listsContainer">
        {listsInvited.map((list) => {
          return (
            <Link to={`/list/${list.id}`} style={{ textDecoration: "none" }}>
              <SquareItem key={list.id} item={list} />
            </Link>
          );
        })}
      </div>

      {showNewListView ? (
        <Suspense fallback={<div>Loading...</div>}>
          <NewListView
            shouldCloseViewPane={onHandleShouldCloseViewPane}
            editMode={false}
          />
        </Suspense>
      ) : (
        ""
      )}
    </div>
  );
}
