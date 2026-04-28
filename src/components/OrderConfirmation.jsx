import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/order.css";
import "../assets/css/loader.css";
import API_BASE from "../config/api";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const order_group_id = location.state?.order_group_id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = order_group_id
          ? `${API_BASE}/api/order/confirmation?order_group_id=${order_group_id}`
          : `${API_BASE}/api/order/confirmation`;

        const res = await fetch(url, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [order_group_id]);

  if (loading){
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Preparing your order summary. Please wait...</p>
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return <h2>No recent orders found</h2>;
  }

  const address = orders[0]?.address;

  return (
    <div className="order-container">
      <div className="order-box">
        <h1>Order Confirmation</h1>
        <h2>Thanks for your order!</h2>
        <h3>Your order will be delivered within 3 to 4 days</h3>

        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Ingredients</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((item, index) => (
              <tr key={index}>
                <td>{item.product_name}</td>
                <td>{item.Ingredients}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 className="address">
          DELIVERY ADDRESS: {address}
        </h4>

        <div className="order-actions">
          <button onClick={() => navigate("/")}>
            Back to Home
          </button>

          <button onClick={() => window.print()}>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}