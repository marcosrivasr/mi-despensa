import "./defaultButton.scss";

export default function DefaultButton({ value, onClick }) {
  return (
    <button className="defaultButton" onClick={onClick}>
      {value}
    </button>
  );
}
