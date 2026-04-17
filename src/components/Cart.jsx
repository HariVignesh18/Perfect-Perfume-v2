import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/loader.css";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext"; // ✅ NEW
import { useNavigate } from "react-router-dom";
import API_BASE from "../config/api";

export default function Cart() {
  const { cartItems, fetchCart } = useCart(); // ✅ USE CONTEXT
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 Fetch cart ONCE
  useEffect(() => {
    const load = async () => {
      await fetchCart();
      setLoading(false);
    };
    load();
  }, []);

  // 🔥 Remove item
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

        await fetchCart(); // ✅ SINGLE SOURCE UPDATE
      } else {
        toast.error("Failed to remove item", { id: toastId });
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error", { id: toastId });
    }
  };

  // 🔥 Clear cart
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

        await fetchCart(); // ✅ sync everything
      } else {
        toast.error("Failed to clear cart", { id: toastId });
      }
    } catch (err) {
      toast.error("Server error", { id: toastId });
    }
  };

  // 🔥 Calculate total
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
      <div className="cart-box">
        <h1>YOUR CART</h1>

        <div className="return-home-wrapper">
          <Link to="/" className="return-home-btn">
            Return to home
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Gender</th>
                    <th>Form</th>
                    <th>Ingredients</th>
                    <th>Feature</th>
                    <th>Volume</th>
                    <th>Country</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.gender}</td>
                      <td>{item.form}</td>
                      <td>{item.ingredients}</td>
                      <td>{item.feature}</td>
                      <td>{item.volume}</td>
                      <td>{item.country}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="total">Total: ₹ {grandTotal}</h3>

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
          </>
        ) : (
          <h1>Your cart is empty</h1>
        )}
      </div>
    </div>
  );
}