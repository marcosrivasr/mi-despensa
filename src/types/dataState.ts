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
}

export interface IItemDetails {
  productid: string;
  title: string;
  price?: number;
  day: number;
  startdate: number;
  frequency: number;
  completed: boolean;
}

export interface IEntry {
  id: string;
  date: number;
  lists: IListDetails[];
}
