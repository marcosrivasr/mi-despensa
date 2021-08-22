import { HeaderProps } from "../types/header";
import { Link, useLocation } from "react-router-dom";
import "./header.scss";
import firebase from "firebase/app";
import "firebase/auth";
import { useEffect, useState } from "react";

export default function Header(props: HeaderProps) {
  const { items } = props;
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  });

  function ShowPublicLinks() {
    return (
      <>
        {items
          .filter((item) => item.protected === false)
          .map((item) => (
            <div key={item.id}>
              <li className={location.pathname === item.goTo ? "active" : ""}>
                <Link to={item.goTo}>{item.title}</Link>
              </li>
            </div>
          ))}
      </>
    );
  }

  function ShowProtectedLinks() {
    return (
      <>
        {items
          .filter((item) => item.protected === true)
          .map((item) => (
            <div key={item.id}>
              <li className={location.pathname === item.goTo ? "active" : ""}>
                <Link to={item.goTo}>{item.title}</Link>
              </li>
            </div>
          ))}
      </>
    );
  }

  return (
    <div className="header">
      {currentUser ? <ShowProtectedLinks /> : <ShowPublicLinks />}
    </div>
  );
}
