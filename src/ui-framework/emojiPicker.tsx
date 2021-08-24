import "./emojiPicker.scss";

export const emojiData = [
  {
    icon: "👨‍👩‍👦",
  },
  {
    icon: "🤘",
  },
  {
    icon: "🍉",
  },
  {
    icon: "😁",
  },
  {
    icon: "🐱‍💻",
  },
  {
    icon: "💖",
  },
];

export function getEmojiIndex(emoji: string) {
  return emojiData.findIndex((e) => e.icon === emoji);
}
interface EmojiPickerProps {
  onEmojiChange: (emoji: string) => void;
  ref?: any;
}

export default function EmojiPicker({ onEmojiChange, ref }) {
  function handleOnChange(e) {
    onEmojiChange(e.target.value);
  }
  return (
    <div className="emojiPickerContainer">
      <select onChange={handleOnChange} ref={ref}>
        {emojiData.map((emoji) => (
          <option value={emoji.icon}>{emoji.icon}</option>
        ))}
      </select>
    </div>
  );
}
