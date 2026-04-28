import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../assets/css/header.css";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  // ✅ Clear activeSection when navigating away from home
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
    } else {
      setActiveSection("home");
    }
  }, [location.pathname]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Single scroll-based section detection
  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const navprodEl = document.getElementById("navprod");
      const scrollY = window.scrollY + 120; // offset for header height

      if (navprodEl && scrollY >= navprodEl.offsetTop) {
        setActiveSection("product");
      } else {
        setActiveSection("home");
      }
    };

    // Run once on mount + after DOM is ready
    const timeout = setTimeout(handleScroll, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // ✅ Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ Scroll helpers
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="header">
      <nav>
        <h1>Perfect Perfume</h1>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "\u2715" : "\u2630"}
        </button>

        <ol className={`menu ${menuOpen ? "menu-open" : ""}`}>
          {/* Home */}
          <li>
            <span
              className={location.pathname === "/" && activeSection === "home" ? "active" : ""}
              onClick={() => { setActiveSection("home"); goHome(); setMenuOpen(false); }}
              style={{ cursor: "pointer" }}
            >
              Home
            </span>
          </li>

          {/* Product */}
          <li>
            <span
              className={location.pathname === "/" && activeSection === "product" ? "active" : ""}
              onClick={() => { setActiveSection("product"); scrollToSection("navprod"); setMenuOpen(false); }}
              style={{ cursor: "pointer" }}
            >
              Product
            </span>
          </li>


          <li>
            <NavLink
  to="/orders"
  className={({ isActive }) => (isActive ? "active" : "")}
  onClick={() => setMenuOpen(false)}
>
  Orders
</NavLink>
          </li>

          {/* Cart */}
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `cart-wrapper ${isActive ? "active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <div className="cart-icon-container">
                <FaShoppingCart className="cart-icon" />
                <span className="cart-count">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </div>
              <span className="cart-text">Cart</span>
            </NavLink>
          </li>

          {/* User */}
          {user ? (
            <li className="profile-container" ref={dropdownRef}>
              <div
                className="avatar"
                onClick={() => setOpen(!open)}
              >
                {user.username[0].toUpperCase()}
              </div>

              {open && (
                <div className="dropdown">
                  <p onClick={() => navigate("/profile")}>My Profile</p>
                  <p onClick={handleLogout}>Logout</p>
                </div>
              )}
            </li>
          ) : (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
}