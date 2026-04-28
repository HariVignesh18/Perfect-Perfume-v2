import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/profile.css";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.username ?? "");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  // Debounced username availability check
  useEffect(() => {
    if (!name || name === user?.username) {
      setError("");
      return;
    }

    if (name.length < 3) {
      setError("Must be at least 3 characters");
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await fetch(
          `${API_BASE}/api/check-username?name=${encodeURIComponent(name)}`
        );
        const data = await res.json();
        if (!data.available) {
          setError("Username already taken");
        } else {
          setError("");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [name, user?.username]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = async () => {
    if (error || !name.trim() || name === user?.username) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/update-name`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // Re-fetch user from session to ensure correct data
      const meRes = await fetch(`${API_BASE}/api/me`, { credentials: "include" });
      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData);
        setName(meData.username);
      }

      setEditing(false);
      toast.success("Name updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.username ?? "");
    setError("");
    setEditing(false);
  };

  if (!user) return <h2>Please login</h2>;

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="avatar-large">
          {user.username?.[0] || "?"}
        </div>

        <div className="profile-name-section">
          {editing ? (
            <div className="edit-name-wrapper">
              <input
                className="edit-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new name"
                autoFocus
              />

              {checking && <p className="name-status checking">Checking availability...</p>}
              {error && <p className="name-status error">{error}</p>}
              {!checking && !error && name !== user.username && name.length >= 3 && (
                <p className="name-status available">✓ Available</p>
              )}

              <div className="edit-name-actions">
                <button
                  className="btn-save"
                  onClick={handleSave}
                  disabled={!!error || saving || name === user.username || name.length < 3}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="display-name-wrapper">
              <h2>{user.username}</h2>
              <button className="btn-edit" onClick={() => setEditing(true)}>
                ✎
              </button>
            </div>
          )}
        </div>

        <p className="profile-email">{user.email}</p>

        <div className="profile-actions">
          <button className="primary" onClick={() => navigate("/orders")}>Your Orders</button>
          <button className="primary" onClick={() => navigate("/cart")}>Your Cart</button>
          <button onClick={() => navigate("/")}>Home</button>
          <button className="logout" onClick={handleLogout}>Logout</button>
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