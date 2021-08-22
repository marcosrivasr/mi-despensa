import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { IItemDetails, IListDetails } from "../types/dataState";
import ShoppingItem from "./shoppingItem";
import { getCurrentDayOfTheWeek, getDate } from "../util/date";
import {
  createEntry,
  existsEntry,
  getShoppingLists,
  getUser,
  getEntry,
  getListsInvited,
  completeItem,
} from "../services/firestoreService";
import { IEntry } from "../types/dataState";

export default function Home() {
  const [today, setToday] = useState<IEntry>(null);
  const [currentUser, setCurrentUser] = useState<firebase.User>(null);
  let entry: IEntry;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        getUserShoppingListForToday(user);
      } else {
      }
    });

    async function getUserShoppingListForToday(userLogged: firebase.User) {
      //const currentUser = firebase.auth().currentUser;
      setCurrentUser(userLogged);
      const entryId = userLogged.uid + "_" + getDate();
      const exists = await existsEntry(entryId);
      const user = await getUser(userLogged.uid);
      const response = await getShoppingLists(userLogged.uid);

      const todayLists = [];
      //recorre toda la lista
      response.forEach((list) => {
        const dataLists: IListDetails = list.data() as IListDetails;

        let itemsForToday = [];
        //recorre toda la lista de items
        itemsForToday = dataLists.items.filter((item: IItemDetails) => {
          return getCurrentDayOfTheWeek() === item.day;
        });

        if (itemsForToday.length > 0) {
          dataLists.items = [...itemsForToday];
          todayLists.push(dataLists);
        }
      });

      if (!exists) {
        entry = {
          id: entryId,
          date: Date.now(),
          lists: todayLists,
        };
        const res = await createEntry(entry);
      } else {
        entry = await getEntry(entryId);
      }
      /* try {
        const invitedLists = await getListsInvited(userLogged.uid);
        invitedLists.forEach((list) => {
          //TODO: se obtienen las listas pero se necesita filtrar por aquellas donde ya está el usuario o es el owner
          entry.lists.push(list.data() as IListDetails);
        });
        await createEntry(entry);
      } catch (error) {} */
      setToday(entry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCompleted(listId, item: IItemDetails, completed) {
    const entryId = currentUser.uid + "_" + getDate();

    try {
      const currentEntry = { ...today };
      debugger;
      const indexList = currentEntry.lists.findIndex((x) => x.id === listId);
      const indexItem = currentEntry.lists[indexList].items.findIndex(
        (x) => x.productid === item.productid
      );
      currentEntry.lists[indexList].items[indexItem].completed = completed;
      console.log(entryId, listId, item, currentEntry);
      await completeItem(entryId, currentEntry);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <h1>Home</h1>
      {currentUser && today && today.lists && today.lists.length
        ? today.lists.map((list) => {
            return (
              <div>
                <h2>
                  {list.title} {list.items.length}
                </h2>
                {list.items.map((item: IItemDetails) => {
                  return (
                    <ShoppingItem
                      item={item}
                      mode="active"
                      list={list.id}
                      onChanged={handleCompleted}
                    />
                  );
                })}
              </div>
            );
          })
        : ""}
    </div>
  );
}
