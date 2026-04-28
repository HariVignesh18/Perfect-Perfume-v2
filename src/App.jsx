import Home from "./components/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import "./assets/css/style.css";
import "./assets/css/perfumes.css";
import Product from "./components/Product";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import OAuthCallback from "./components/OAuthCallback";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import Orders from "./components/Orders";
import { Toaster } from "react-hot-toast";

export default function App() {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);
  return (
    <div className="app-container">
      {!hideLayout && <Header />}
      <div className={`content ${hideLayout ? "no-header" : ""}`}>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </div>
  );
}