import Emoji from "../ui-framework/icon";
import "./squareItem.scss";

export default function SquareItem({ text }) {
  return (
    <div className="squareItem">
      <div className="container">
        <div className="icon">
          <Emoji symbol="🥞" label="familia" />
        </div>
      </div>
      <div className="text">{text}</div>
    </div>
  );
}
