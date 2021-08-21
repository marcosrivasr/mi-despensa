import "./emojiPicker.scss";
export default function EmojiPicker({ onEmojiChange }) {
  function handleOnChange(e) {
    onEmojiChange(e.target.value);
  }
  return (
    <div className="emojiPickerContainer">
      <select onChange={handleOnChange}>
        <option value="👨‍👩‍👦">👨‍👩‍👦</option>
        <option value="🤘">🤘</option>
        <option value="🍉">🍉</option>
        <option value="😁">😁</option>
        <option value="🐱‍💻">🐱‍💻</option>
      </select>
    </div>
  );
}
