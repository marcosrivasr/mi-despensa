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
import { Redirect } from "react-router";
import { formatPrice } from "../util/string";

import "./home.scss";

export default function Home() {
  const [today, setToday] = useState<IEntry>(null);
  const [currentUser, setCurrentUser] = useState<firebase.User>(null);
  const [logged, setLogged] = useState(null);

  let entry: IEntry;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLogged(true);
        getUserShoppingListForToday(user);
      } else {
        setLogged(false);
      }
    });

    async function getUserShoppingListForToday(userLogged: firebase.User) {
      setCurrentUser(userLogged);
      const entryId = userLogged.uid + "_" + getDate();

      const user = await getUser(userLogged.uid);
      const listsResponse = await getShoppingLists(userLogged.uid);
      const listsInvitedResponse = await getListsInvited(userLogged.uid);

      const todayLists = [];
      //recorre toda la lista
      listsResponse.forEach((list) => {
        const itemsForToday = list.items.filter(
          (item) => getCurrentDayOfTheWeek() === item.day
        );

        if (itemsForToday.length > 0) {
          todayLists.push(list);
        }
      });

      listsInvitedResponse.forEach((list) => {
        const itemsForToday = list.items.filter(
          (item) => getCurrentDayOfTheWeek() === item.day
        );

        if (itemsForToday.length > 0) {
          todayLists.push(list);
        }
      });

      entry = {
        id: entryId,
        date: Date.now(),
        lists: todayLists,
      };

      const exists = await existsEntry(entryId);
      if (exists) {
        const entryResponse = await getEntry(entryId);
        entry = entryResponse;
      } else {
        await createEntry(entry);
        entry = await getEntry(entryId);
      }

      setToday(entry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCompleted(
    entryId: string,
    listId: string,
    item: IItemDetails,
    completed: boolean
  ) {
    try {
      const currentEntry = { ...today };
      debugger;
      const listToUpdate = currentEntry.lists.find((x) => x.id === listId);
      const itemToUpdate = listToUpdate.items.find(
        (x) => x.productid === item.productid
      );

      itemToUpdate.completed = !itemToUpdate.completed;

      setToday(currentEntry);

      await completeItem(entryId, currentEntry);
    } catch (error) {
      console.error(error);
    }
  }

  function ListName({ name, people }) {
    return (
      <div className="listDetails">
        <div>
          <h3>{name}</h3>
        </div>
        <div className="total">{people.length + 1} integrantes</div>
      </div>
    );
  }

  function NumberOfItems({ current, total }) {
    return (
      <div className="numberOfItems">
        <div className="current">{current} items</div>
        <div className="total">{total} items</div>
      </div>
    );
  }
  function Totals({ current, total }) {
    return (
      <div className="totals">
        <div className="current">{formatPrice(current)}</div>
        <div className="total">{formatPrice(total)}</div>
      </div>
    );
  }

  if (logged === null) return <div>"Loading"</div>;

  if (logged === false) return <Redirect to="/login" />;

  return (
    <div>
      <h1>Home</h1>
      {currentUser && today && today.lists && today.lists.length
        ? today.lists.map((list) => {
            return (
              <div key={list.id}>
                <div className="headerList">
                  <ListName name={list.title} people={list.users} />

                  <NumberOfItems
                    current={list.items.filter((item) => item.completed).length}
                    total={list.items.length}
                  />
                  <Totals
                    total={list.items.reduce(
                      (sum, item) => sum + item.price,
                      0
                    )}
                    current={list.items
                      .filter((item) => item.completed)
                      .reduce((sum, item) => sum + item.price, 0)}
                  />
                </div>

                {list.items.map((item: IItemDetails) => {
                  return (
                    <ShoppingItem
                      key={item.productid}
                      item={item}
                      mode="active"
                      list={list.id}
                      entryId={today.id}
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
