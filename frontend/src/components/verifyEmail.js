import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../stylesheets/verifyEmail.css";

const VerifyEmail = () => {
  const [isValidUrl, setIsValidUrl] = useState(false);
  const params = useParams();

  const verifyEmailUrl = async () => {
    const url = `two-factor-server.vercel.app/api/users/${params.id}/verify/${params.token}`;
    const { data } = await axios.get(url);
    if (data.message === "Email verified") {
      setIsValidUrl(true);
    } else {
      setIsValidUrl(false);
    }
  };

  useEffect(() => {
    verifyEmailUrl();
  }, [params]);

  return (
    <>
      {isValidUrl ? (
        <div className="verifiedContainer">
          <h1>Email Verified Correctly</h1>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      ) : (
        <h1>Code 404 not found</h1>
      )}
    </>
  );
};

export default VerifyEmail;
