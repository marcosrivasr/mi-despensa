import { useEffect, useState, lazy, Suspense } from "react";
import { IItemDetails, IListDetails } from "../types/dataState";
import Checkbox from "../ui-framework/checkbox";
import { getDayOfTheWeekGivenANumber } from "../util/date";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "./shoppingItem.scss";

interface shoppingItemProps {
  item: IItemDetails;
  list: string;
  mode: "active" | "read";
  onEdit?: (id: string) => void;
  onChanged?: (listId: string, item: IItemDetails, completed: boolean) => void;
}
export default function ShoppingItem({
  item,
  list,
  mode,
  onEdit,
  onChanged,
}: shoppingItemProps) {
  const d = new Date(item.startdate);

  function handleCheckboxChange(state) {
    onChanged(list, item, state);
  }

  async function handleRemoveClick() {
    try {
      const responseList = await firebase
        .firestore()
        .collection("shopping_lists")
        .doc(list)
        .get();

      const updatedList = responseList
        .data()
        .items.filter((i: IItemDetails) => i.productid !== item.productid);
      await firebase
        .firestore()
        .collection("shopping_lists")
        .doc(list)
        .update({ items: updatedList });
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditClick() {
    onEdit(item.productid);
  }

  return (
    <div className="row">
      {mode === "active" ? (
        <Checkbox checked={item.completed} onChanged={handleCheckboxChange} />
      ) : null}
      <div className="row-container">
        <div className="product-info">
          <div>{item.title}</div>
          <div className="price">
            {item.price}{" "}
            {mode === "active" ? <button>Modificar costo</button> : ""}
          </div>
        </div>
        <div className="date">
          <div>
            Los {getDayOfTheWeekGivenANumber(item.day)} cada {item.frequency}{" "}
            semanas
          </div>
        </div>
      </div>
      {mode === "active" ? (
        ""
      ) : (
        <>
          <button onClick={handleEditClick}>Editar</button>
          <button onClick={handleRemoveClick}>x</button>
        </>
      )}
    </div>
  );
}
