import React from "react";
import "../stylesheets/loggedIn.css";

const LoggedIn = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <div className="loggedInContainer">
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default LoggedIn;
