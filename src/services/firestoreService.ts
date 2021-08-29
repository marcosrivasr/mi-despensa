import firebase from "firebase/app";
import "firebase/firestore";
import { IEntry, IListDetails } from "../types/dataState";

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

export async function getListsInvited(uid: string): Promise<IListDetails[]> {
  let res = [];
  try {
    const response = await firebase
      .firestore()
      .collection(SHOPPING_LISTS)
      .where("users", "array-contains", uid)
      .get();

    if (response.empty) return [];

    response.forEach((doc) => {
      res.push(doc.data());
    });

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
