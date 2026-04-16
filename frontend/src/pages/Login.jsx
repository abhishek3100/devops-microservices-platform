import { useState } from "react";
import API from "../api/api";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await API.post("/api/users/login", {
      email,
      password,
    });

    setToken(res.data.token);
  } catch (err) {
    alert("Login failed");
  }
};

  return (
  <div className="container">
    <h2>🔐 Login</h2>

    <input
      placeholder="Enter email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Enter password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleLogin}>Login</button>
  </div>
);
}