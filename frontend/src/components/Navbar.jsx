import { Link, NavLink } from "react-router-dom";
import { BookMarked } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar-shell">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="BookSwap home">
          <span className="navbar-brand-mark" aria-hidden="true">
            <BookMarked className="navbar-brand-icon" />
          </span>
          <span className="navbar-brand-copy">
            <span className="navbar-brand-name">BookSwap</span>
            <span className="navbar-brand-tag">Swap, read, repeat</span>
          </span>
        </Link>

        <div className="navbar-actions">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `navbar-link navbar-link-ghost ${isActive ? "is-active" : ""}`
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `navbar-link navbar-link-primary ${isActive ? "is-active" : ""}`
            }
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
