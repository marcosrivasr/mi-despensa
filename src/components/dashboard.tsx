import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/home">Home</Link> {}
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}
