import firebase from "firebase/app";
import "firebase/firestore";
import { useState } from "react";
import { IItemDetails } from "../types/dataState";
import ViewPane from "./viewPane";
import { v4 as uuidv4 } from "uuid";

export default function NewListItemViewPane({
  shouldCloseViewPane,
  list,
  collectionId,
}) {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [frequency, setFrequency] = useState<number>(0);

  const db = firebase.firestore();
  const auth = firebase.auth();

  async function handleClickAddItem(e) {
    const productid = uuidv4();
    const startdate = new Date();
    const updatedItem: IItemDetails = {
      productid,
      title,
      price,
      day,
      frequency,
      startdate,
    };

    try {
      const listItems = list.items;
      listItems.push(updatedItem);

      console.log(list);

      const response = await db
        .collection("shopping_lists")
        .doc(collectionId)
        .update(list);

      shouldCloseViewPane(false);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <ViewPane shouldCloseViewPane={shouldCloseViewPane}>
      <h2>Agregar un elemento a la despensa</h2>
      <div>
        <label>Título</label>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <label>Precio</label>
        <input
          type="number"
          onChange={(e) => setPrice(parseInt(e.target.value))}
          value={price}
        />

        <label>Día de la semana</label>
        <select onChange={(e) => setDay(parseInt(e.target.value))}>
          <option value="0">Domingo</option>
          <option value="1">Lunes</option>
          <option value="2">Martes</option>
          <option value="3">Miercoles</option>
          <option value="4">Jueves</option>
          <option value="5">Viernes</option>
          <option value="6">Sábado</option>
        </select>

        <label>Frecuencia (semanas)</label>
        <input
          type="number"
          onChange={(e) => setFrequency(parseInt(e.target.value))}
          value={frequency}
        />

        <button onClick={handleClickAddItem}>Agregar elemento</button>
      </div>
    </ViewPane>
  );

  /**
   * productid: string;
  title: string;
  price?: number;
  day: number;
  startdate: Date;
  frequency: number;
   */
}
