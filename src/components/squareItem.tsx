import { useEffect, useState } from "react";
import { IListDetails, IUser } from "../types/dataState";
import Emoji from "../ui-framework/icon";
import "./squareItem.scss";
import { getUser } from "../services/firestoreService";
import firebase from "firebase/app";
import "firebase/auth";

interface SquareItemProps {
  item: IListDetails;
}

export default function SquareItem({ item }: SquareItemProps) {
  const [listOwner, setListOwner] = useState<IUser>(null);

  useEffect(() => {
    getUserInfo();

    async function getUserInfo() {
      const response = await getUser(item.ownerid);
      const user = response.data() as IUser;
      setListOwner(user);
    }
  });

  return (
    <div className="squareItem">
      <div className="container">
        <div className="icon">
          <Emoji symbol={item.icon} label="familia" />
          {firebase.auth().currentUser.uid === item.ownerid ? (
            ""
          ) : (
            <img src={listOwner ? listOwner.photoURL : ""} alt="" />
          )}
        </div>
      </div>
      <div className="text">{item.title}</div>
    </div>
  );
}
