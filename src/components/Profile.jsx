import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/profile.css";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return <h2>Please login</h2>;

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="avatar-large">
          {user.username[0].toUpperCase()}
        </div>

        <h2>{user.username}</h2>
        <p>{user.email}</p>

        <div className="profile-actions">
          <button className="primary" onClick={() => navigate("/cart")}>Your Cart</button>
          <button onClick={() => navigate("/")}>Home</button>
          <button className="logout" onClick={() => handleLogout()}>Logout</button>
        </div>

        <div className="danger">
          <h3>⚠ Danger Zone</h3>
          <p>This action is irreversible.</p>
          <button className="delete">Delete Account</button>
        </div>

      </div>
    </div>
  );
}