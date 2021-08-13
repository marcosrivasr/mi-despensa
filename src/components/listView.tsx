import { useEffect, useState, lazy, Suspense } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const NewListItemViewPane = lazy(() => import("./newListItemViewPane"));

export default function ListView({ match, location, history }) {
  const [listDetails, setListDetails] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [shouldShowListItemViewPane, setShouldShowListItemViewPane] =
    useState(false);
  const db = firebase.firestore();
  const auth = firebase.auth();
  const listId = match.params.id;

  useEffect(() => {
    getCurrentUsername();
    getListDetails();
    async function getCurrentUsername() {
      try {
        const data = await db
          .collection("users")
          .where("uid", "==", auth.currentUser.uid)
          .get();
        if (data.empty) {
        } else {
          data.forEach((userFound) => {
            setCurrentUsername(userFound.data());
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    async function getListDetails() {
      console.log("list details");
      try {
        const data = await db
          .collection("shopping_lists")
          .where("id", "==", listId)
          .get();
        if (data.empty) {
          console.log("vacio");
        } else {
          console.log("datos cargados", data);
          const items = [];
          data.forEach((doc) => {
            setCurrentDoc(doc.id);
            items.push(doc.data());
          });
          setListDetails([...items]);
          console.log("items", items, typeof items, Array.isArray(items));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  function showListItems() {
    return (
      <>
        {listDetails[0].items.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </>
    );
  }

  function handleClickAddItem(e) {
    setShouldShowListItemViewPane(true);
  }

  function onHandleShouldCloseViewPane(state) {
    setShouldShowListItemViewPane(state);
  }

  return (
    <div>
      <div>
        <input />
        <button onClick={handleClickAddItem}>Añadir elemento</button>
      </div>

      <div>
        <h2>{listDetails ? listDetails[0].title : ""}</h2>

        {listDetails ? showListItems() : ""}
      </div>

      {shouldShowListItemViewPane ? (
        <Suspense fallback={<div>Loading...</div>}>
          <NewListItemViewPane
            shouldCloseViewPane={onHandleShouldCloseViewPane}
            list={listDetails ? listDetails[0] : {}}
            collectionId={currentDoc}
          />
        </Suspense>
      ) : (
        ""
      )}
    </div>
  );
}
