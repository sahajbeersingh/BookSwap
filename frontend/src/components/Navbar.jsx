import { NavLink } from "react-router-dom";
import "./Navbar.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Login", to: "/login" },
  { label: "Sign Up", to: "/signup" },
];

function Navbar() {
  return (
    <header className="site-header">
      <nav className="top-nav" aria-label="Main navigation">
        <NavLink to="/" className="brand" aria-label="BookSwap home">
          <span className="brand-mark" aria-hidden="true">
            BS
          </span>
          <span className="brand-text">BookSwap</span>
        </NavLink>

        <ul className="nav-links" role="list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-active" : "nav-link"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
