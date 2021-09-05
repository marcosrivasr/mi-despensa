import firebase from "firebase/app";
import "firebase/firestore";
import { IEntry, IListDetails } from "../types/dataState";
import { getCurrentDayOfTheWeek, getDate } from "../util/date";

const USERS = "users";
const SHOPPING_LISTS = "shopping_lists";
const ENTRIES = "entries";

export async function existsEntry(entryName: string): Promise<boolean> {
  try {
    const response = await firebase
      .firestore()
      .collection(ENTRIES)
      .doc(entryName)
      .get();
    return response.exists;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createEntry(entry: IEntry) {
  try {
    const res = await firebase
      .firestore()
      .collection(ENTRIES)
      .doc(entry.id)
      .set(entry);
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateEntry(entry) {
  try {
    const res = await firebase
      .firestore()
      .collection(ENTRIES)
      .doc(entry.id)
      .update(entry);
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUser(uid: string) {
  return await firebase.firestore().collection(USERS).doc(uid).get();
}

export async function getShoppingLists(uid: string): Promise<IListDetails[]> {
  let lists = [];
  try {
    const response = await firebase
      .firestore()
      .collection(SHOPPING_LISTS)
      .where("ownerid", "==", uid)
      .get();

    if (response.empty) return [];

    response.forEach((doc) => {
      lists.push(doc.data() as IListDetails);
    });

    return lists;
  } catch (error) {}
}

export async function getEntry(entryName: string): Promise<IEntry> {
  const response = await firebase
    .firestore()
    .collection(ENTRIES)
    .doc(entryName)
    .get();
  return response.data() as IEntry;
}

export async function getListsInvited(uid: string) {
  let res = [];
  try {
    let response = await firebase
      .firestore()
      .collection(SHOPPING_LISTS)
      .where("users", "array-contains-any", [uid])
      .get();

    if (response.empty) return [];

    response.forEach((doc) => {
      res.push(doc.data());
    });
    response = null;

    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getListsOwned(uid: string) {
  let res = [];
  try {
    const response = await firebase
      .firestore()
      .collection(SHOPPING_LISTS)
      .where("ownerid", "==", uid)
      .get();

    response.forEach((doc) => {
      res.push(doc.data());
    });

    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function completeItem(doc, entry) {
  debugger;
  try {
    const response = await firebase
      .firestore()
      .collection(ENTRIES)
      .doc(doc)
      .set(entry);

    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getEntries(userLogged: firebase.User) {
  const user = userLogged;

  //obtenemos las listas del usuario
  const listsOwned = await getShoppingLists(user.uid);

  // ahora obtenemos las listas invitadas
  const listsInvited = await getListsInvited(user.uid);

  const listsOwnedForToday = await processListsForToday(listsOwned);

  const listsInvitedForToday = await processListsForToday(listsInvited);

  return [...listsOwnedForToday, ...listsInvitedForToday];
}

/**
 * Procesa las listas para crear una entrada con los elementos de hoy
 * @param lists
 * @returns A promise with the lists for today
 */
async function processListsForToday(lists: IListDetails[]) {
  let tempEntries = Array<IEntry>();
  const date = getDate();
  //recorremos las listas para obtener solo las que son de hoy
  for (let i = 0; i < lists.length; i++) {
    const list = lists[i];
    //filtramos los elementos de hoy en cada lista
    const items = list.items.filter(
      (item) => item.day === getCurrentDayOfTheWeek()
    );

    //actulizamos los items en cada lista
    list.items = [...items];
    if (list.items.length === 0) continue;

    const entryId = `${date}_${list.id}`;

    const exists = await existsEntry(entryId);
    console.log(exists);
    if (exists) {
      const entry = await getEntry(entryId);
      tempEntries.push(entry);
    } else {
      const entry: IEntry = {
        id: entryId,
        date: Date.now(),
        list: { ...list },
      };
      console.log("entry", entry);
      await createEntry(entry);
      tempEntries.push(entry);
    }
  }

  return tempEntries;
}
