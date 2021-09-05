export enum DataState {
  None,
  Loading,
  Completed,
  Error,
}

export enum LoginState {
  None,
  UserIsRegistered,
  UsernameAvailable,
  UsernameTaken,
  LoginCompleted,
}

export interface IListDetails {
  id: string;
  ownerid: string;
  title: string;
  users: string[];
  items: IItemDetails[];
  icon: string;
  timestamp: number;
}

export interface IItemDetails {
  productid: string;
  title: string;
  price?: number;
  day: number;
  startdate: number;
  frequency: number;
  completed: boolean;
  timestamp: number;
}

export interface IEntry {
  id: string;
  date: number;
  list: IListDetails;
}

export interface IUser {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  photoURL: string;
}
