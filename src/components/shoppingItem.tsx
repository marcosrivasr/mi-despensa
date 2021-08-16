import { IItemDetails } from "../types/dataState";
import Checkbox from "../ui-framework/checkbox";
import { getDayOfTheWeekGivenANumber } from "../util/date";
import "./shoppingItem.scss";

interface shoppingItemProps {
  item: IItemDetails;
  mode: "active" | "read";
}
export default function shoppingItem({ item, mode }: shoppingItemProps) {
  const d = new Date(item.startdate);

  function handleCheckboxChange(state) {
    item.completed = state;
  }

  return (
    <div className="row">
      {mode === "active" ? <Checkbox /> : ""}
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
            Los {getDayOfTheWeekGivenANumber(d.getDay()) + "s"} cada{" "}
            {item.frequency} semanas
          </div>
        </div>
      </div>
    </div>
  );
}
