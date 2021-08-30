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
import {
  getListsInvited,
  getListsOwned,
  getUser,
} from "../services/firestoreService";

import "./listsView.scss";

const NewListView = lazy(() => import("./newListView"));

export default function Dashboard() {
  const [logged, setLogged] = useState(null);
  const [isUserSigned, setIsUserSigned] = useState<DataState>(DataState.None);
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewListView, setshowNewListView] = useState(false);

  const [lists, setLists] = useState([]);
  const [listsInvited, setListsInvited] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setLogged(true);
        setCurrentUser(user);

        const listsOwned = await getListsOwned(user.uid);
        setLists(listsOwned);

        const listsInvited = await getListsInvited(user.uid);
        setListsInvited(listsInvited);
      } else {
        setLogged(false);
      }
    });
  }, []);

  function onHandleShouldCloseViewPane(state) {
    setshowNewListView(state);
  }

  if (logged === null) return <div>Loading</div>;

  if (logged === false) return <Redirect to="/login" />;

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
            <Link
              key={list.id}
              to={`/list/${list.id}`}
              style={{ textDecoration: "none" }}
            >
              <SquareItem key={list.id} item={list} />
            </Link>
          );
        })}
      </div>

      <div className="listsContainer">
        {listsInvited.map((list) => {
          return (
            <Link
              key={list.id}
              to={`/list/${list.id}`}
              style={{ textDecoration: "none" }}
            >
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
