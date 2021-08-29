import { useEffect, useState, useRef } from "react";
import { CommandButtonItem } from "./ui-types";
import { v4 as uuidv4 } from "uuid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import "./commandButton.scss";

interface CommandButtonProps {
  items: CommandButtonItem[];
  icon: IconDefinition;
  onSelected: (item: CommandButtonItem) => void;
}

export default function CommandButton({
  items,
  icon,
  onSelected,
}: CommandButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState(null);
  const [id, setId] = useState(uuidv4());
  const ref = useRef(null);

  useEffect(() => {
    return () => {
      window.removeEventListener("click", () => {});
    };
  }, [showMenu]);

  function handleClick(e) {
    setShowMenu(!showMenu);
    window.addEventListener(
      "click",
      (e) => {
        ref.current.id = id;
        console.log(showMenu, e.target === ref.current);
        if (e.target !== ref.current) {
          setShowMenu(false);
        }
      },
      true
    );
  }

  function handleItemClick(item) {
    setSelected(item);
    onSelected(item);
    setShowMenu(false);
  }

  return (
    <div className="commandButton">
      <button type="button" id={id} onClick={handleClick} ref={ref}>
        <FontAwesomeIcon className="fontawesome-icon" icon={icon} />
      </button>
      <div
        className="menu"
        style={{ display: showMenu ? "block" : "none", position: "absolute" }}
      >
        {items.map((item) => (
          <a key={item.id} onClick={() => handleItemClick(item)}>
            {item.name} {selected && selected.id === item.id && "selected"}
          </a>
        ))}
      </div>
    </div>
  );
}
