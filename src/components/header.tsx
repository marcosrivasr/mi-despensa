import { HeaderProps } from "../types/header";
import { Link, useLocation } from "react-router-dom";
import "./header.scss";

export default function Header(props: HeaderProps) {
  const { items } = props;
  const location = useLocation();
  return (
    <div className="header">
      {items.map((item) => (
        <div key={item.id}>
          <li className={location.pathname === item.goTo ? "active" : ""}>
            <Link to={item.goTo}>{item.title}</Link>
          </li>
        </div>
      ))}
    </div>
  );
}
