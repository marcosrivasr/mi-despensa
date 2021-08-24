import { useEffect, useState, lazy, Suspense } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import ShoppingItem from "./shoppingItem";
import PrimaryButton from "../ui-framework/primaryButton";
import MainInput from "./mainInput";
import { IItemDetails, IListDetails } from "../types/dataState";
import "./listView.scss";
const NewListItemViewPane = lazy(() => import("./newListItemViewPane"));
const NewListView = lazy(() => import("./newListView"));

export default function ListView({ match, location, history }) {
  const [listDetails, setListDetails] = useState<IListDetails>(null);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [itemId, setItemId] = useState("");
  const [showPane, setShowPane] = useState(false);
  const [showListPane, setShowListPane] = useState(false);
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
      db.collection("shopping_lists")
        .doc(listId)
        .onSnapshot((doc) => {
          console.log(doc.data());
          setListDetails(doc.data() as IListDetails);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEditItem(id) {
    setItemId(id);
    setShowPane(true);
  }

  function showListItems() {
    return (
      <>
        <MainInput
          list={listDetails ? listDetails : {}}
          collectionId={listId}
        />
        {listDetails.items
          .sort((a, b) => a.startdate - b.startdate)
          .reverse()
          .map((item) => (
            <ShoppingItem
              key={item.productid}
              item={item}
              mode="read"
              list={listId}
              onEdit={handleEditItem}
            />
          ))}
      </>
    );
  }

  /**
   * Función para mostrar la vista de Edición de lista
   * @param id
   */
  function handleEditList(id) {
    setShowListPane(true);
  }

  function handleClose(state) {
    setShowListPane(false);
  }

  return (
    <div>
      <div>
        <PrimaryButton onClick={handleEditList} value="Editar lista" />
      </div>

      <div>
        <div className="listViewInfo">
          <h2 className="listTitle">{listDetails ? listDetails.title : ""}{listDetails ? listDetails.icon : ""}</h2>
          <h2>
            $
            {listDetails
              ? listDetails.items.reduce((acc, item) => acc + item.price, 0)
              : ""}
          </h2>
        </div>

        {listDetails ? showListItems() : ""}
      </div>

      {showPane ? (
        <Suspense fallback={<div>Loading...</div>}>
          <NewListItemViewPane
            showPane={showPane}
            itemid={itemId}
            list={listDetails}
            onClose={() => setShowPane(false)}
          />
        </Suspense>
      ) : (
        ""
      )}

      {showListPane ? (
        <Suspense fallback={<div>Loading...</div>}>
          <NewListView
            shouldCloseViewPane={handleClose}
            editMode={true}
            listDetails={listDetails}
          />
        </Suspense>
      ) : (
        ""
      )}
    </div>
  );
}
