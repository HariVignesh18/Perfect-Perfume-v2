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
  const [activeSection, setActiveSection] = useState("home");

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

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

  // ✅ Scroll-based section detection
  useEffect(() => {
  if (location.pathname !== "/") return;

  const sections = [
    { id: "navprod", name: "product" },
    { id: "navcon", name: "contact" },
  ];

  const timeout = setTimeout(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sections.find(
              (sec) => sec.id === entry.target.id
            );
            if (match) {
              setActiveSection(match.name);
            }
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, 100); // 👈 wait for DOM render

  return () => clearTimeout(timeout);
}, [location.pathname]);

  // ✅ Detect top → Home
  useEffect(() => {
  if (location.pathname !== "/") return;

  const handleScroll = () => {
    if (window.scrollY < 80) {
      setActiveSection("home");
    }
  };

  handleScroll(); // 👈 IMPORTANT (runs on load)

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
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

        <ol className="menu">
          {/* Home */}
          <li>
            <span
              className={activeSection === "home" ? "active" : ""}
              onClick={goHome}
              style={{ cursor: "pointer" }}
            >
              Home
            </span>
          </li>

          {/* Product */}
          <li>
            <span
              className={activeSection === "product" ? "active" : ""}
              onClick={() => scrollToSection("navprod")}
              style={{ cursor: "pointer" }}
            >
              Product
            </span>
          </li>

          {/* Contact */}
          <li>
            <span
              className={activeSection === "contact" ? "active" : ""}
              onClick={() => scrollToSection("navcon")}
              style={{ cursor: "pointer" }}
            >
              Contact
            </span>
          </li>

          {/* Cart */}
          <li>
            <NavLink
              to="/cart"
              className={`cart-wrapper ${location.pathname === "/cart" ? "active" : ""}`}
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