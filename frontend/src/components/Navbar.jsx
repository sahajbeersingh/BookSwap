import { Link } from "react-router-dom";
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
          <Link to="/login" className="navbar-link navbar-link-ghost">
            Login
          </Link>
          <Link to="/register" className="navbar-link navbar-link-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
