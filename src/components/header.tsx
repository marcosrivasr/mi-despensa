import { HeaderProps } from "../types/header";
import { Link } from "react-router-dom";
import "./header.scss";

export default function Header(props: HeaderProps) {
  const { items } = props;
  return (
    <div className="header">
      {items.map((item) => (
        <div key={item.id}>
          <a>
            <Link to={item.goTo}>{item.title}</Link>
          </a>
        </div>
      ))}
    </div>
  );
}
