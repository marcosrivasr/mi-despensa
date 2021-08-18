import { HeaderProps } from "../types/header";
import firebase from "firebase/app";
import "firebase/auth";
import { Link } from "react-router-dom";

export const headerDataItems: HeaderProps = {
  items: [
    {
      id: "0",
      title: "Home",
      goTo: "/home",
    },
    {
      id: "1",
      title: "Sign in",
      goTo: "/login",
    },
    {
      id: "3",
      title: "Listas",
      goTo: "/lists",
    },
    {
      id: "2",
      title: "Log out",
      goTo: "/logout",
    },
  ],
};
