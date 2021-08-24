import { IUser } from "../types/dataState";
import "./usersView.scss";

interface UsersView {
  users: IUser[];
}
export default function UsersView({ users }) {
  return (
    <div className="usersView">
      {!users ? "No users added" : ""}
      {users
        ? users.map((user) => {
            return (
              <div key={user.uid}>
                <img src={user.photoURL} width="32" />
                {user.displayName}
              </div>
            );
          })
        : ""}
    </div>
  );
}
