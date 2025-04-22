import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/products");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin}>
        <div className="form-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in</p>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="name@company.com" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit">Sign In</button>

        <div className="auth-links">
          Already have an account? <Link to="/signup">Sign in</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;