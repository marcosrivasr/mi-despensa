import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./checkbox.scss";

interface CheckboxProps {
  checked?: boolean;
}

export default function Checkbox({ checked }: CheckboxProps) {
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  function assignClasses(...classes) {
    return classes
      .filter((className) => className !== "")
      .map((className) => `${className}`)
      .join(" ");
  }

  function handleClick(e) {
    setCheckboxChecked(!checkboxChecked);
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
          style={{ color: "white", fontSize: "1.5em" }}
        />
      </button>
      <input type="checkbox" checked={checked} hidden />
    </>
  );
}
