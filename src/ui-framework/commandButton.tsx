import { useEffect, useState, useRef } from "react";
import { CommandButtonItem } from "./ui-types";

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
  const [showMenu, setShowMenu] = useState<Boolean>(false);
  const [selected, setSelected] = useState<CommandButtonItem>(null);
  const [bodyWidth, setBodyWidth] = useState<number>(0);
  const ref = useRef(null);

  useEffect(() => {
    setBodyWidth(document.body.getBoundingClientRect().width);
    return () => {
      window.removeEventListener("click", () => {});
    };
  }, [showMenu]);

  function handleClick(e) {
    setShowMenu(!showMenu);
    window.addEventListener(
      "click",
      (e) => {
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
      <button type="button" onClick={handleClick} ref={ref}>
        <FontAwesomeIcon className="fontawesome-icon" icon={icon} />
        {selected ? (
          <span className="value">{selected.name}</span>
        ) : (
          "Seleccionar"
        )}
      </button>
      <div
        className="menu"
        style={{
          display: showMenu ? "block" : "none",
          position: "absolute",
          left: ref.current
            ? ref.current.getBoundingClientRect().x + 250 > bodyWidth
              ? bodyWidth - 250 - 20
              : ref.current.getBoundingClientRect().x
            : "auto",
          top: ref.current
            ? ref.current.getBoundingClientRect().y +
              ref.current.getBoundingClientRect().height
            : "auto",
        }}
      >
        {items.map((item: CommandButtonItem) => (
          <a key={item.id} onClick={() => handleItemClick(item)}>
            {item.name} {selected && selected.id === item.id && "selected"}
          </a>
        ))}
      </div>
    </div>
  );
}
