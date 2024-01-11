import React, { useState } from "react";
import "../stylesheets/register.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [emailVerifMsg, setEmailVerifMsg] = useState("");

  const { firstName, lastName, email, password } = user;

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("two-factor-server.vercel.app/api/users", user)
      .then((response) => {
        setEmailVerifMsg(response.data.message);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setErrorMessage(error.response.data.message);
        }
      });
  };

  return (
    <div className="registerContainer">
      <div className="registerFormContainer">
        <div className="left">
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button className="purpleButton">Sign In</button>
          </Link>
        </div>
        <div className="right">
          <form className="formContainer" onSubmit={handleSubmit}>
            <h1>Register</h1>
            <input
              className="formInput"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              required
            />
            <input
              className="formInput"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              required
            />
            <input
              className="formInput"
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={email}
              required
            />
            <input
              className="formInput"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
            {errorMessage && (
              <div className="errorMessage"> {errorMessage}</div>
            )}
            {emailVerifMsg && (
              <div className="successMessage"> {emailVerifMsg}</div>
            )}
            <button type="submit" className="registerButton">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
