import { Link } from "react-router-dom";
import "firebase/auth";
import { IfFirebaseAuthedAnd } from "@react-firebase/auth";
export default function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link to="/home">Home</Link> {}
      <Link to="/dashboard">Dashboard</Link>
      <div>
        <IfFirebaseAuthedAnd
          filter={({ providerId }) => providerId !== "anonymous"}
        >
          {({ providerId, user }) => {
            return (
              <div>
                You are authenticated with {providerId} {user.displayName}
              </div>
            );
          }}
        </IfFirebaseAuthedAnd>
      </div>
    </div>
  );
}
