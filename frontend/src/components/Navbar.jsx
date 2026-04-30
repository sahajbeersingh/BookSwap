import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { persistAuthToken } from "../lib/api";
import "./Navbar.css";

const authNavItems = [
  { label: "Books", to: "/books" },
  { label: "Sell", to: "/sell" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Collection", to: "/collection" },
  { label: "Trades", to: "/trades" },
  { label: "Messages", to: "/messages" },
];

const publicNavItems = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
];

const accountNavItems = [
  { label: "Login", to: "/login" },
  { label: "Sign Up", to: "/signup" },
];

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();
  const navItems = isAuthenticated ? authNavItems : publicNavItems;
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "BS";
  const avatarUrl = user?.avatar_url || user?.image_url || "";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    persistAuthToken("");
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  if (loading) {
    return null;
  }

  return (
    <header className="site-header">
      <nav className="top-nav" aria-label="Main navigation">
        <div className="nav-row nav-row-main">
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

          <div className="nav-account" aria-label="Account navigation">
            <ul className="nav-links nav-links-account" role="list">
              {!isAuthenticated
                ? accountNavItems.map((item) => (
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
                  ))
                : null}
              {isAuthenticated ? (
                <li className="avatar-menu" ref={menuRef}>
                  <button
                    type="button"
                    className={
                      menuOpen ? "avatar-button avatar-active" : "avatar-button"
                    }
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((prev) => !prev)}
                  >
                    {avatarUrl ? (
                      <img
                        className="avatar-image"
                        src={avatarUrl}
                        alt="Profile"
                      />
                    ) : (
                      <span className="avatar" aria-hidden="true">
                        {initials}
                      </span>
                    )}
                  </button>
                  {menuOpen ? (
                    <div className="avatar-dropdown" role="menu">
                      <NavLink to="/profile" role="menuitem">
                        Account details
                      </NavLink>
                      <NavLink to="/profile/edit" role="menuitem">
                        Edit profile
                      </NavLink>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  ) : null}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
