import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "../assets/css/auth.css";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login success");
      login(data.user);

      navigate("/");
    } else {
      alert(data.error);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleLogin}>
        <h1>Welcome Back!</h1>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Log In</button>

        <div className="alternative">
          <hr /><h5>Or</h5><hr />
        </div>

        <a className="google-btn" href={`${API_BASE}/react-google-login`}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
          <span>Log in with Google</span>
        </a>

        <div className="signup-link">
          <h3>Don't have an account?</h3>
          <Link to="/register">Register now</Link>
        </div>
      </form>
    </AuthLayout>
  );
}