import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { IListDetails, IUser } from "../types/dataState";
import { v4 as uuidv4 } from "uuid";
import "./newListView.scss";
import { Redirect } from "react-router";
import ViewPane from "./viewPane";
import EmojiPicker, { getEmojiIndex } from "../ui-framework/emojiPicker";
import UsersView from "./usersView";

interface NewListViewProps {
  shouldCloseViewPane: (boolean) => void;
  editMode: boolean;
  listDetails?: IListDetails;
}

export default function NewListView({
  shouldCloseViewPane,
  editMode,
  listDetails,
}: NewListViewProps) {
  console.log(editMode);
  const [title, setTitle] = useState(listDetails ? listDetails.title : "");
  const [userText, setUserText] = useState("");
  const [emoji, setEmoji] = useState(listDetails ? listDetails.icon : "");
  const [usersFound, setUsersFound] = useState([]);
  const [usersAdded, setUsersAdded] = useState([]);
  const [invited, setInvited] = useState([]);
  const [test, setTest] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState(null);
  const [gotoList, setGotoList] = useState(null);
  const [status, setStatus] = useState("");
  const db = firebase.firestore();
  const auth = firebase.auth();

  const selectRef = useRef(null);

  useEffect(() => {
    getCurrentUsername();

    async function getCurrentUsername() {
      try {
        const data = await db
          .collection("users")
          .where("uid", "==", auth.currentUser.uid)
          .get();
        if (data.empty) {
        } else {
          data.forEach((userFound) => {
            setCurrentUsername(userFound.data());
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("useEffect for listDetails");
    if (listDetails && editMode) {
      console.log("edit mode");
      //selectRef.current.selectedIndex = getEmojiIndex(listDetails.icon);
      let userList: IUser[] = [];
      let promises = [];

      listDetails.users.forEach((user) => {
        console.log({ user });
        promises.push(db.collection("users").doc(user).get());
      });

      Promise.all(promises).then((res) => {
        res.map((doc) => {
          const item = doc.data() as IUser;
          userList = [...userList, item];
        });
        setUsersAdded(userList);
      });
    }
  }, [listDetails]);

  function handleChangeSearchUser(e) {
    const text = e.target.value;
    setUserText(text);
  }

  async function handleClickSearch(e) {
    if (userText === "") {
      return;
    }
    setStatus("Buscando...");
    setUsersFound([]);
    let itemsFound = [];
    try {
      const data = await db
        .collection("users")
        .where("username", "==", userText)
        .where("username", "!=", (currentUsername as any).username)
        .get();
      if (data.empty) {
        setStatus("No se encontraron resultados...");
      } else {
        data.forEach((userFound) => {
          setStatus("");
          itemsFound.push(userFound.data());
        });

        setUsersFound([...itemsFound]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function addUserFound(user) {
    const users = [...usersAdded, user];
    setUsersAdded([...users]);
  }

  async function handleCreateList(e) {
    e.preventDefault();
    if (title !== "" && usersAdded.length >= 1) {
      const id: string = uuidv4();
      const ownerid: string = currentUsername?.uid;
      const items = [];
      const users = usersAdded.map((x) => x.uid);
      const newList: IListDetails = {
        id,
        title,
        ownerid,
        items,
        users,
        icon: emoji,
        timestamp: Date.now(),
      };
      try {
        //await db.collection("shopping_lists").add(newList);
        await db.collection("shopping_lists").doc(id).set(newList);
        //setGotoList(response.id);//este es el id de la colección
        setGotoList(id);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Completa los datos");
    }
  }

  async function handleUpdateList(e) {
    e.preventDefault();
    try {
      listDetails.title = title;
      listDetails.icon = emoji;
      listDetails.users = usersAdded.map((x) => x.uid);
      await db
        .collection("shopping_lists")
        .doc(listDetails.id)
        .set(listDetails);

      shouldCloseViewPane(true);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChangeTitle(e) {
    setTitle(e.target.value);
  }

  function handleEmojiPickerChanged(emoji) {
    setEmoji(emoji);
  }

  return (
    <ViewPane closePane={shouldCloseViewPane}>
      {gotoList ? <Redirect to={`/list/${gotoList}`} /> : ""}
      <label>Nombre de lista</label>
      <input onChange={handleChangeTitle} value={title} />
      <label>Usuarios</label>
      <input onChange={handleChangeSearchUser} value={userText} />
      <button onClick={handleClickSearch}>Buscar usuario</button>
      <button>Agregar usuario</button>
      <div className="search-users">
        {status}
        {usersFound.map((user) => {
          return (
            <div key={user.displayName}>
              <img src={user.photoURL} alt={user.displayName} width="32" />
              {user.displayName}
              {!usersAdded.includes(user) ? (
                <button onClick={(e) => addUserFound(user)}>Añadir</button>
              ) : (
                " Añadido"
              )}
            </div>
          );
        })}
      </div>

      <div className="added-users">
        <div>Usuarios añadidos a la lista</div>
        <UsersView users={usersAdded} />
      </div>

      <div>
        <EmojiPicker onEmojiChange={handleEmojiPickerChanged} ref={selectRef} />
      </div>

      {editMode && editMode === true ? (
        <button onClick={handleUpdateList}>Actualizar lista</button>
      ) : (
        <button onClick={handleCreateList}>Crear lista</button>
      )}
    </ViewPane>
  );
}
