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
} from "../services/firestoreService";
import { IEntry } from "../types/dataState";

export default function Home() {
  const [today, setToday] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        getUserShoppingListForToday();
      } else {
      }
    });

    async function getUserShoppingListForToday() {
      const currentUser = firebase.auth().currentUser;
      const entryId = currentUser.uid + "_" + getDate();
      const exists = await existsEntry(entryId);
      const user = await getUser(currentUser.uid);
      const response = await getShoppingLists(user.data().uid);

      const dataToday = [];
      //recorre toda la lista
      response.forEach((list) => {
        const listItem: IListDetails = list.data() as IListDetails;

        let todayList = [];
        //recorre toda la lista de items
        todayList = listItem.items.filter((item: IItemDetails) => {
          return getCurrentDayOfTheWeek() === item.day;
        });

        if (todayList.length > 0) {
          listItem.items = [...todayList];
          dataToday.push(listItem);
        }
      });

      if (!exists) {
        const entry: IEntry = {
          id: entryId,
          date: Date.now(),
          lists: dataToday,
        };
        const res = await createEntry(entry);
        console.log({ res });
      }
      setToday(dataToday);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h1>Home</h1>
      {today.length
        ? today.map((list) => {
            return (
              <div>
                <h2>
                  {list.title} {list.lists?.length}
                </h2>
                {list.items.map((item: IItemDetails) => {
                  return (
                    <ShoppingItem item={item} mode="active" list={list.id} />
                  );
                })}
              </div>
            );
          })
        : ""}
    </div>
  );
}
