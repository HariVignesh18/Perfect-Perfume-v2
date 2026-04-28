import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/checkout.css";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import API_BASE, { RAZOR_PAY } from "../config/api";

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
  const { cartItems, fetchCart } = useCart();

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  const toastId = toast.loading("Processing payment...");

  try {
    // 🔹 STEP 1: Calculate amount
    const amount = buyNowItem
      ? buyNowItem.price * buyNowItem.quantity
      : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (amount <= 0) {
      toast.error("Cart is empty or invalid amount", { id: toastId });
      setSubmitting(false);
      return;
    }

    // 🔹 STEP 2: Create Razorpay order
    const orderRes = await fetch(`${API_BASE}/api/create-razorpay-order`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const order = await orderRes.json();

    // 🔹 STEP 3: Open Razorpay
    const options = {
      key: RAZOR_PAY,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: "Perfect Perfume",
      description: "Test Mode — Use UPI: success@razorpay",
      prefill: {
        email: "test@example.com",
        contact: "9999999999",
      },
      method: {
        upi: false,
        card: false,
        emi: false,
        paylater: false
      },
      handler: async function (response) {
        // 🔹 STEP 4: Verify payment
        const verifyRes = await fetch(`${API_BASE}/api/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.status === "success") {
          // 🔹 STEP 5: NOW place order (your original logic)

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
            toast.success("Payment successful 🎉", { id: toastId });
            navigate("/order-confirmation", {
              state: { order_group_id: data.order_group_id }
            });
            await fetchCart();
          } else {
            toast.error(data.error || "Order failed", { id: toastId });
            setSubmitting(false);
          }
        } else {
          toast.error("Payment verification failed", { id: toastId });
          setSubmitting(false);
        }
      },

      theme: {
        color: "#111",
      },
      modal: {
        ondismiss: function () {
          toast.dismiss(toastId);
          setSubmitting(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.log(err);
    toast.error("Something went wrong", { id: toastId });
    setSubmitting(false);
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

          <div className="test-payment-info">
            <p><b>🧪 Demo Mode — Test Payment Guide</b></p>
            <p><b>Netbanking:</b> Select any bank → click Success</p>
            <p><b>Wallet:</b> Select any wallet → click Success</p>
          </div>
        </form>
      </div>
    </div>
  );
}