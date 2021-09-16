import { useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { IItemDetails, IListDetails } from "../types/dataState";
import { v4 as uuidv4 } from "uuid";
import { CommandButtonItem } from "../ui-framework/ui-types";
import "./mainInput.scss";
import CommandButton from "../ui-framework/commandButton";
import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";

interface MainInputProps {
  list: IListDetails;
  collectionId: string;
  onUpdateList: (item: IItemDetails) => void;
}

export default function MainInput({
  list,
  collectionId,
  onUpdateList,
}: MainInputProps) {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [day, setDay] = useState<number>(-1);
  const [frequency, setFrequency] = useState<number>(-1);

  const db = firebase.firestore();
  const auth = firebase.auth();

  const ref = useRef(null);

  async function handleClickAddItem(e) {
    e.preventDefault();

    if (title === "" || day < 0 || frequency < 0) return;

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
      onUpdateList(updatedItem);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  }

  const commandButtonsDay: CommandButtonItem[] = [
    {
      id: "sunday",
      name: "Domingo",
      value: "0",
      onClick: () => {
        console.log("Hola");
      },
    },
    {
      id: "monday",
      name: "Lunes",
      value: "1",
      onClick: () => {
        console.log("Hola");
      },
    },
    {
      id: "tuesday",
      name: "Martes",
      value: "2",
      onClick: () => {
        console.log("Hola");
      },
    },
    {
      id: "wednesday",
      name: "Miércoles",
      value: "3",
      onClick: () => {
        console.log("Hola");
      },
    },
    {
      id: "thursday",
      name: "Jueves",
      value: "4",
      onClick: () => {
        console.log("Hola");
      },
    },
    {
      id: "friday",
      name: "Viernes",
      value: "5",
      onClick: () => {
        console.log("Hola");
      },
    },
    {
      id: "saturday",
      name: "Sábado",
      value: "6",
      onClick: () => {
        console.log("Hola");
      },
    },
  ];

  const commandButtonsFrequency: CommandButtonItem[] = [
    {
      id: "sunday",
      name: "Cada semana",
      value: "1",
      onClick: () => {
        console.log("Hola");
      },
    },
    {
      id: "monday",
      name: "Cada 2 semanas",
      value: "2",
      onClick: () => {
        console.log("Hola");
      },
    },
    {
      id: "tuesday",
      name: "Cada 3 semanas",
      value: "3",
      onClick: () => {
        console.log("Hola");
      },
    },
    {
      id: "wednesday",
      name: "Cada mes",
      value: "4",
      onClick: () => {
        console.log("Hola");
      },
    },
  ];

  function handleSelectedDay(item: CommandButtonItem) {
    setDay(parseInt(item.value));
  }

  function handleSelectedFrequency(item: CommandButtonItem) {
    setFrequency(parseInt(item.value));
  }

  return (
    <div className="mainInput">
      <form onSubmit={handleClickAddItem} className="form">
        <input
          ref={ref.current}
          type="text"
          placeholder="Añadir Elemento"
          className="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <div className="priceAndCommandButtonsContainer">
          <div className="priceContainer">
            <span>$</span>
            <input
              type="number"
              className="price"
              placeholder="0.00"
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              value={price}
            />
          </div>

          <CommandButton
            items={commandButtonsDay}
            icon={faCalendarAlt}
            onSelected={handleSelectedDay}
          />
          <CommandButton
            items={commandButtonsFrequency}
            icon={faClock}
            onSelected={handleSelectedFrequency}
          />
        </div>
        <input type="submit" value="Añadir" className="addButton" />
      </form>
    </div>
  );
}
