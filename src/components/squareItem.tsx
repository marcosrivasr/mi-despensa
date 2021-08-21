import Emoji from "../ui-framework/icon";
import "./squareItem.scss";

export default function SquareItem({ text, emoji }) {
  return (
    <div className="squareItem">
      <div className="container">
        <div className="icon">
          <Emoji symbol={emoji} label="familia" />
        </div>
      </div>
      <div className="text">{text}</div>
    </div>
  );
}
