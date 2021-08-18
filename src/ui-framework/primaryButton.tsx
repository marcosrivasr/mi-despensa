import "./primaryButton.scss";

export default function PrimaryButton({ value, onClick }) {
  return (
    <button className="primaryButton" onClick={onClick}>
      {value}
    </button>
  );
}
