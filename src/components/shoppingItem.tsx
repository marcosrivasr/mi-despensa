import { useEffect, useState, lazy, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { IItemDetails, IListDetails } from "../types/dataState";
import Checkbox from "../ui-framework/checkbox";
import { getDayOfTheWeekGivenANumber } from "../util/date";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "./shoppingItem.scss";
import { classNames } from "../util/string";

interface shoppingItemProps {
  item: IItemDetails;
  list: string;
  mode: "active" | "read";
  entryId?: string;
  onEdit?: (id: string) => void;
  onChanged?: (completed: boolean) => void;
}
export default function ShoppingItem({
  entryId,
  item,
  list,
  mode,
  onEdit,
  onChanged,
}: shoppingItemProps) {
  const d = new Date(item.startdate);

  function handleCheckboxChange(state: boolean) {
    onChanged(state);
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

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <div className={classNames("row", item.completed ? "completed" : "")}>
      {mode === "active" ? (
        <Checkbox checked={item.completed} onChanged={handleCheckboxChange} />
      ) : null}
      <div className="row-container">
        <div className="product-info">
          <div>{item.title}</div>
        </div>
        <div className="date">
          <div>
            {getDayOfTheWeekGivenANumber(item.day)} cada {item.frequency}{" "}
            semanas
          </div>
        </div>
      </div>
      <div className="price">{formatter.format(item.price)}</div>
      {mode === "active" ? (
        ""
      ) : (
        <>
          <button onClick={handleEditClick} className="editButton">
            <FontAwesomeIcon className="fontawesome-icon" icon={faPen} />
          </button>
          <button onClick={handleRemoveClick} className="deleteButton">
            <FontAwesomeIcon className="fontawesome-icon" icon={faTrash} />
          </button>
        </>
      )}
    </div>
  );
}
