import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
      navigate("/login");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignup}>
        <div className="form-header">
          <h2>Create Account</h2>
          <p>Please fill in your details to register</p>
        </div>

        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input 
            id="name"
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="John Smith" 
            required 
          />
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
            minLength="8"
          />
        </div>

        <button type="submit">Create Account</button>

        <div className="auth-links">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;