import "firebase/auth";
import { IfFirebaseAuthedAnd } from "@react-firebase/auth";
import "firebase/firestore";

import {
  FirestoreProvider,
  FirestoreDocument,
  FirestoreCollection,
} from "@react-firebase/firestore";
import { config } from "../config/config";
import firebase from "firebase/app";
import { useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState("");

  function getDisplayName() {
    return (
      <IfFirebaseAuthedAnd
        filter={({ providerId }) => providerId !== "anonymous"}
      >
        {({ user }) => {
          return <span>{user.displayName}</span>;
        }}
      </IfFirebaseAuthedAnd>
    );
  }

  function getDataItems() {
    return (
      <FirestoreProvider {...config} firebase={firebase}>
        <FirestoreDocument path="/users/1">
          {(d) => {
            return d.isLoading ? "Loading" : <pre>{d.value?.name}</pre>;
          }}
        </FirestoreDocument>
      </FirestoreProvider>
    );
  }

  function getDataCollections() {
    return (
      <FirestoreProvider {...config} firebase={firebase}>
        <FirestoreCollection path="/users/">
          {(d) => {
            console.log(d.value);
            return d.isLoading
              ? "Loading"
              : d.value.map((item) => {
                  return <div>{item.name}</div>;
                });
          }}
        </FirestoreCollection>
      </FirestoreProvider>
    );
  }

  return (
    <div>
      <h2>Bienvenido {getDisplayName()}</h2>
      {/* getDataItems() */}
      {getDataCollections()}
    </div>
  );
}
