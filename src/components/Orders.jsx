import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config/api";
import "../assets/css/loader.css";

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderGroups, setOrderGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setOrderGroups(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orderGroups.length === 0) return <p className="orders-loading">No orders found.</p>;

  return (
    <div className="orders-container">
      <div className="orders-page">
        <h2>Your Orders</h2>

        {orderGroups.map((group, index) => {
          const orderDate = new Date(group.order_date);
          const daysPassed = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
          const isDelivered = daysPassed >= 5;

          return (
          <div key={group.order_group_id || index} className="order-group-card">
            <div className="order-group-header">
              <div>
                <span className="order-group-date">
                  {orderDate.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className={`order-status ${isDelivered ? "status-delivered" : "status-transit"}`}>
                  {isDelivered ? "✓ Delivered" : "🚚 In Transit"}
                </span>
              </div>
              <span className="order-group-total">₹{group.total}</span>
            </div>

            <div className="order-group-address">
              📍 {group.address}
            </div>

            <div className="order-group-items">
              {group.items.map((item) => (
                <div key={item.order_id} className="order-item-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">x{item.quantity}</span>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}