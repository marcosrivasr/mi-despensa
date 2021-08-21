import { useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { IItemDetails } from "../types/dataState";
import { v4 as uuidv4 } from "uuid";
import "./mainInput.scss";

export default function MainInput({ list, collectionId }) {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [frequency, setFrequency] = useState<number>(1);

  const db = firebase.firestore();
  const auth = firebase.auth();

  const ref = useRef(null);

  async function handleClickAddItem(e) {
    e.preventDefault();
    const productid = uuidv4();
    const startdate = Date.now();
    const updatedItem: IItemDetails = {
      productid,
      title,
      price,
      day,
      frequency,
      startdate,
      completed: false,
      timestamp: Date.now(),
    };

    try {
      const listItems = list.items;
      listItems.push(updatedItem);

      const response = await db
        .collection("shopping_lists")
        .doc(collectionId)
        .update(list);

      setTitle("");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="mainInput">
      <form onSubmit={handleClickAddItem}>
        <input
          ref={ref.current}
          type="text"
          placeholder="Añadir Elemento"
          className="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <div className="priceContainer">
          <span>$</span>
          <input
            type="number"
            className="price"
            placeholder="0.00"
            onChange={(e) => setPrice(parseInt(e.target.value))}
            value={price}
          />
        </div>
        <select onChange={(e) => setDay(parseInt(e.target.value))}>
          <option value="0">Domingo</option>
          <option value="1">Lunes</option>
          <option value="2">Martes</option>
          <option value="3">Miercoles</option>
          <option value="4">Jueves</option>
          <option value="5">Viernes</option>
          <option value="6">Sábado</option>
        </select>
        <select onChange={(e) => setFrequency(parseInt(e.target.value))}>
          <option value="1">Cada semana</option>
          <option value="2">Cada quince días</option>
          <option value="4">Cada mes</option>
          <option value="0">Una sola vez</option>
        </select>

        <input type="submit" className="add" value="Añadir" hidden />
      </form>
    </div>
  );
}
