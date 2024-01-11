import React, { useState } from "react";
import "../stylesheets/login.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    authenticatorToken: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { email, password, authenticatorToken } = user;

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://two-factor-server.vercel.app/api/auth", user);
      localStorage.setItem("token", res.user);
      window.location = "/";
    } catch (error) {
      console.log(error);
      if (error.response.status >= 400 && error.response.status <= 500) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginFormContainer">
        <div className="leftLogin">
          <form className="formContainer" onSubmit={handleSubmit}>
            <h1 className="loginTitle">Login into Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={email}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={password}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Token"
              name="authenticatorToken"
              onChange={handleChange}
              value={authenticatorToken}
              required
              className="input"
            />
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            <button type="submit" className="purpleButton">
              Log In
            </button>
          </form>
        </div>
        <div className="rightLogin">
          <h1>New Here?</h1>
          <Link to="/register">
            <button type="button" className="blueButton">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
