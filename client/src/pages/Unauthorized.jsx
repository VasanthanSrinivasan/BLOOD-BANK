
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Access denied</h1>
        <p>Your account does not have permission to open this page.</p>
        <Link to="/login">Return to login</Link>
      </section>
    </main>
  );
}
