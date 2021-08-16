import firebase from "firebase/app";
import "firebase/firestore";
import { IEntry } from "../types/dataState";

const USERS = "users";
const SHOPPING_LISTS = "shopping_lists";
const ENTRIES = "entries";

export async function existsEntry(entryName: string) {
  const response = await firebase
    .firestore()
    .collection(ENTRIES)
    .where("id", "==", entryName)
    .get();
  return !response.empty;
}

export async function createEntry(entry: IEntry) {
  const res = await firebase.firestore().collection(ENTRIES).add(entry);
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
