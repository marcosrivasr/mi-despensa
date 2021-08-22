import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./checkbox.scss";

interface CheckboxProps {
  checked?: boolean;
  onChanged?: (checked: boolean) => void;
}

export default function Checkbox({ checked, onChanged }: CheckboxProps) {
  const [checkboxChecked, setCheckboxChecked] = useState(checked || false);

  function assignClasses(...classes) {
    return classes
      .filter((className) => className !== "")
      .map((className) => `${className}`)
      .join(" ");
  }

  function handleClick(e) {
    const completed = !checkboxChecked;
    setCheckboxChecked(completed);
    onChanged(completed);
  }

  return (
    <>
      <button
        className={assignClasses("checkbox", checkboxChecked ? "checked" : "")}
        onClick={handleClick}
      >
        <FontAwesomeIcon
          className="fontawesome-icon"
          icon={faCheck}
          style={{ color: "white" }}
        />
      </button>
      <input
        type="checkbox"
        checked={checked}
        hidden
        style={{ display: "none" }}
      />
    </>
  );
}
