import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import "../assets/css/auth.css";
import API_BASE from "../config/api";

export default function Register() {
  const navigate = useNavigate();

  // 🔥 State (VERY IMPORTANT)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Registered successfully");
        navigate("/login"); // 🔥 redirect after success
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleRegister}>
        <h1>Registration Form</h1>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Set a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Submit</button>

        <button
          type="button"
          className="reset-button"
          onClick={() => {
            setUsername("");
            setEmail("");
            setPassword("");
          }}
        >
          Reset
        </button>

        <div className="alternative">
          <hr /><h5>Or</h5><hr />
        </div>

        <a
          className="google-btn"
          href={`${API_BASE}/google/login`}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
          />
          Register with Google
        </a>

        <div className="signup-link">
          <h3>Already have an account?</h3>
          <Link to="/login">Log In</Link>
        </div>
      </form>
    </AuthLayout>
  );
}