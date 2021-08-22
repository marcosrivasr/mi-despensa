import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { IItemDetails, IListDetails } from "../types/dataState";
import ViewPane from "./viewPane";
import { v4 as uuidv4 } from "uuid";

interface NewListItemViewPaneProps {
  showPane: boolean;
  list: IListDetails;
  itemid: string;
  onClose: () => void;
}

export default function NewListItemViewPane({
  showPane,
  list,
  itemid,
  onClose,
}: NewListItemViewPaneProps) {
  const [show, setShow] = useState(showPane);
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [currentItem, setCurrentItem] = useState<IItemDetails>(null);
  const [frequency, setFrequency] = useState<number>(0);
  const selectRef = useRef(null);

  const db = firebase.firestore();
  const auth = firebase.auth();

  useEffect(() => {
    const item: IItemDetails = list.items.find((i) => i.productid === itemid);
    setCurrentItem({ ...item });
    setTitle(item.title);
    setPrice(item.price);
    setDay(item.day);
    setFrequency(item.frequency);

    selectRef.current.selectedIndex = item.day;
  }, []);

  async function handleClickAddItem(e) {
    const startdate = Date.now();
    const updatedItem: IItemDetails = {
      productid: itemid,
      title,
      price,
      day,
      frequency,
      startdate,
      completed: false,
      timestamp: currentItem.timestamp,
    };

    try {
      const listItems = list.items;
      const index = listItems.findIndex((i) => i.productid === itemid);
      listItems[index] = updatedItem;

      const response = await db
        .collection("shopping_lists")
        .doc(list.id)
        .update(list);

      onClose();
    } catch (error) {
      console.error(error);
    }
    /* const productid = uuidv4();
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

      console.log(list);

      const response = await db
        .collection("shopping_lists")
        .doc(list.id)
        .update(list);

      setShow(false);
    } catch (error) {
      console.error(error);
    } */
  }

  function handleShow() {
    onClose();
  }
  return (
    <ViewPane closePane={handleShow}>
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
        <select
          onChange={(e) => setDay(parseInt(e.target.value))}
          ref={selectRef}
        >
          <option value="0" {...(day === 2 ? "yes" : "no")}>
            Domingo
          </option>
          <option value="1" {...(day === 1 ? " selected" : "")}>
            Lunes
          </option>
          <option value="2" {...(day === 2 ? " selected" : "")}>
            Martes
          </option>
          <option value="3" {...(day === 3 ? "selected" : "")}>
            Miercoles
          </option>
          <option value="4" {...(day === 4 ? "selected" : "")}>
            Jueves
          </option>
          <option value="5" {...(day === 5 ? "selected" : "")}>
            Viernes
          </option>
          <option value="6" {...(day === 6 ? "selected" : "")}>
            Sábado
          </option>
        </select>

        <label>Fecha de inicio</label>
        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />

        <label>Frecuencia (semanas)</label>
        <input
          type="number"
          onChange={(e) => setFrequency(parseInt(e.target.value))}
          value={frequency}
        />

        <button onClick={handleClickAddItem}>Actualizar elemento</button>
      </div>
    </ViewPane>
  );
}
