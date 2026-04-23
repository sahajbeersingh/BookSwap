import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="auth-page" aria-labelledby="not-found-heading">
      <div className="auth-card">
        <h1 id="not-found-heading">Page not found</h1>
        <p className="auth-subtitle">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link className="btn btn-primary" to="/">
          Go back home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
