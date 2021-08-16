import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { IListDetails } from "../types/dataState";
import { v4 as uuidv4 } from "uuid";
import "./newListView.scss";
import { Redirect } from "react-router";
import ViewPane from "./viewPane";

export default function NewListView({ shouldCloseViewPane }) {
  const [title, setTitle] = useState("");
  const [userText, setUserText] = useState("");
  const [usersFound, setUsersFound] = useState([]);
  const [usersAdded, setUsersAdded] = useState([]);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [gotoList, setGotoList] = useState(null);
  const [status, setStatus] = useState("");
  const db = firebase.firestore();
  const auth = firebase.auth();

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
    console.log("aa");
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
      };
      try {
        await db.collection("shopping_lists").add(newList);
        //setGotoList(response.id);//este es el id de la colección
        setGotoList(id);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Completa los datos");
    }
  }

  function handleChangeTitle(e) {
    setTitle(e.target.value);
  }

  return (
    <ViewPane shouldCloseViewPane={shouldCloseViewPane}>
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
        {usersAdded.length === 0 ? "No users added" : ""}
        {usersAdded.map((user) => {
          return <div key={user.uid}>{user.displayName}</div>;
        })}
      </div>

      <button onClick={handleCreateList}>Crear lista</button>
    </ViewPane>
  );
}
