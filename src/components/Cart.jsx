import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/loader.css";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config/api";

export default function Cart() {
  const { cartItems, setCartItems, cartCount, setCartCount, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      await fetchCart();
      setLoading(false);
    };
    load();
  }, []);

  const removeItem = async (id) => {
    const toastId = toast.loading("Removing item...");

    try {
      const res = await fetch(
        `${API_BASE}/api/cart/remove/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        toast.success("Item removed!", { id: toastId });
        await fetchCart();
      } else {
        toast.error("Failed to remove item", { id: toastId });
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error", { id: toastId });
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to empty your cart?")) return;

    if (cartItems.length === 0) {
      toast("Cart is already empty 🛒");
      return;
    }

    const toastId = toast.loading("Clearing your cart...");

    try {
      const res = await fetch(`${API_BASE}/api/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Cart cleared 🧹", { id: toastId });
        await fetchCart();
      } else {
        toast.error("Failed to clear cart", { id: toastId });
      }
    } catch (err) {
      toast.error("Server error", { id: toastId });
    }
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;

    // Optimistic update — instant UI change
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
    setCartCount((prev) => {
      const oldItem = cartItems.find((i) => i.id === id);
      return prev + (newQty - (oldItem?.quantity || 0));
    });

    // Background sync — no await, no blocking
    fetch(`${API_BASE}/api/cart/update/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    }).catch(() => {
      // Revert on failure
      fetchCart();
      toast.error("Failed to update quantity");
    });
  };

  const grandTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-page">
        <h2>Your Cart</h2>

        {cartItems.length > 0 ? (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-header">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-subtotal">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  <div className="cart-item-details">
                    <span className="cart-item-price">₹{item.price} each</span>
                    <div className="cart-qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-footer">
                    <span className="cart-item-meta">
                      {item.volume}ml · {item.form} · {item.country}
                    </span>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-card">
              <div className="cart-summary-row">
                <span>{cartItems.length} item{cartItems.length > 1 ? "s" : ""}</span>
                <span className="cart-summary-total">₹{grandTotal}</span>
              </div>

              <div className="cart-actions">
                <button className="empty-cart" onClick={clearCart}>
                  Empty Cart
                </button>
                <button
                  className="buy-now"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="cart-empty-card">
            <p>🛒 Your cart is empty</p>
            <Link to="/" className="return-home-btn">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}