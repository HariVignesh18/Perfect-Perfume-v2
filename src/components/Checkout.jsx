import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/checkout.css";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import API_BASE from "../config/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    room: "",
    street: "",
    area: "",
    state: "",
    pincode: "",
    country: "",
  });
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const { fetchCart } = useCart();

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    const toastId = toast.loading("Placing your order...");
  e.preventDefault();
  console.log("BuyNowItem:", buyNowItem);
  const url = buyNowItem
    ? `${API_BASE}/api/order/buy-now`
    : `${API_BASE}/api/order/cart`;

  const body = buyNowItem
    ? {
        product_id: buyNowItem.product_id,
        quantity: buyNowItem.quantity,
        plotno: form.room,
        street: form.street,
        area: form.area,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
      }
    : {
        plotno: form.room,
        street: form.street,
        area: form.area,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
      };

  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
        toast.success("Order placed successfully 🎉", { id: toastId }); 
      navigate("/order-confirmation");
      await fetchCart();
    } else {
        toast.error(data.error || "Order failed", { id: toastId });
    }
  } catch (err) {
    console.log(err);
    toast.error(data.error || "Something went wrong");;
  }
};

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h1>Details for Delivery Address</h1>
        <hr />

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-row">
            <label>Room No / Plot No</label>
            <input
              name="room"
              placeholder="Enter your Plot/Room number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Street Address</label>
            <input
              name="street"
              placeholder="Enter your Street Address"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Area Name</label>
            <input
              name="area"
              placeholder="Enter Your Area"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>State</label>
            <input
              name="state"
              placeholder="Enter your state"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Pincode</label>
            <input
              name="pincode"
              placeholder="Enter your pincode"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Select Country</label>
            <select name="country" onChange={handleChange} required>
              <option value="">Select your country</option>
              <option value="India">India</option>
            </select>
          </div>

          <div className="actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Placing Order..." : "Submit"}
            </button>
            <button type="reset">Reset</button>
          </div>

          <p className="note">
            <b>NOTE:</b><br />
            "You can pay upon delivery after inspecting your perfume."
          </p>
        </form>
      </div>
    </div>
  );
}