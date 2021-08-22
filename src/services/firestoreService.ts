import firebase from "firebase/app";
import "firebase/firestore";
import { IEntry } from "../types/dataState";

const USERS = "users";
const SHOPPING_LISTS = "shopping_lists";
const ENTRIES = "entries";

export async function existsEntry(entryName: string) {
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
  const res = await firebase
    .firestore()
    .collection(ENTRIES)
    .doc(entry.id)
    .set(entry);
  return res;
}

export async function updateEntry(entry) {
  const res = await firebase
    .firestore()
    .collection(ENTRIES)
    .doc(entry.id)
    .update(entry);
  return res;
}

export async function getUser(uid: string) {
  return await firebase.firestore().collection(USERS).doc(uid).get();
}

export async function getShoppingLists(uid: string) {
  return await firebase
    .firestore()
    .collection(SHOPPING_LISTS)
    .where("ownerid", "==", uid)
    .get();
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
  try {
    const response = await firebase
      .firestore()
      .collection(SHOPPING_LISTS)
      .where("users", "array-contains", uid)
      .get();

    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function completeItem(doc, entry) {
  try {
    const response = await firebase
      .firestore()
      .collection(ENTRIES)
      .doc(doc)
      .update(entry);

    return response;
  } catch (error) {
    throw new Error(error);
  }
}
