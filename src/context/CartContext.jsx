import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import API_BASE from "../config/api";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]); // ✅ NEW
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        credentials: "include",
      });

      if (!res.ok) {
        setCartItems([]);
        setCartCount(0);
        return;
      };
      const data = await res.json();

      setCartItems(data); // ✅ store full cart

      const totalItems = data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalItems);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
  if (!user) {
    setCartItems([]);
    setCartCount(0); // ✅ IMPORTANT
  } else {
    fetchCart(); // ✅ fetch only when logged in
  }
}, [user]);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);