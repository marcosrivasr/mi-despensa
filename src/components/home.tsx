import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { IItemDetails, IListDetails } from "../types/dataState";
import ShoppingItem from "./shoppingItem";
import { getEntries, completeItem } from "../services/firestoreService";
import { IEntry } from "../types/dataState";
import { Redirect } from "react-router";
import { formatPrice } from "../util/string";

import Loading from "../ui-framework/loading";

import "./home.scss";

export default function Home() {
  const [today, setToday] = useState<IEntry>(null);
  const [entries, setEntries] = useState<IEntry[]>([]);
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
      const r = await getEntries(userLogged);
      setEntries(r);
    }
  }, []);

  async function handleCompleted(
    entry: IEntry,
    list: IListDetails,
    item: IItemDetails,
    completed: boolean
  ) {
    try {
      const copyEntries: IEntry[] = [...entries];

      const indexEntry = copyEntries.findIndex((e) => e.id === entry.id);

      const indexItem = copyEntries[indexEntry].list.items.findIndex(
        (i) => i.productid === item.productid
      );

      copyEntries[indexEntry].list.items[indexItem].completed = completed;

      await completeItem(entry.id, entry);

      setEntries([...copyEntries]);
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

  if (logged === null) return <Loading />;

  if (logged === false) return <Redirect to="/login" />;

  return (
    <div>
      <h1>Home</h1>
      {entries ? (
        entries.map((entry: IEntry) => (
          <div key={entry.id} className="listContainer">
            <div className="headerList">
              <ListName name={entry.list.title} people={entry.list.users} />
              <div className="col">
                <NumberOfItems
                  current={
                    entry.list.items.filter((item) => item.completed).length
                  }
                  total={entry.list.items.length}
                />
                <Totals
                  total={entry.list.items.reduce(
                    (sum, item) => sum + item.price,
                    0
                  )}
                  current={entry.list.items
                    .filter((item) => item.completed)
                    .reduce((sum, item) => sum + item.price, 0)}
                />
              </div>
            </div>

            {entry.list.items.map((item: IItemDetails) => {
              return (
                <ShoppingItem
                  key={item.productid}
                  item={item}
                  mode="active"
                  list={entry.list.id}
                  entryId={entry.id}
                  onChanged={(state: boolean) =>
                    handleCompleted(entry, entry.list, item, state)
                  }
                />
              );
            })}
          </div>
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
}
