import React, { useState, useRef, useEffect, use } from "react";
import { FIREBASE_API_KEY } from "../../config";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/authContext";
import { useContext } from "react";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSignUpPage, setIsSignUpPage] = useState(true);
const authCtx = useContext(AuthContext);


  const navigate = useNavigate();

  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current.focus();
  }, [isSignUpPage]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (isSignUpPage) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              email,
              password,
              returnSecureToken: true,
            }),
          },
        );

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        alert("Sign up successful! Please login.");

        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsSignUpPage(false);
      } catch (error) {
        alert(error.message);
      }
    } else {
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              returnSecureToken: true,
            }),
          },
        );

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        authCtx.loginHandler(data.idToken, email);

        navigate("/home");

        setEmail("");
        setPassword("");
        setConfirmPassword("");

      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <div className="card shadow p-4" style={{ width: "25rem" }}>
        <h3 className="text-center mb-4">
          {isSignUpPage ? "Sign Up" : "Login"}
        </h3>

        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <input
              ref={emailRef}
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignUpPage && (
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              {isSignUpPage ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>
      </div>

      <button
        className="btn btn-link mt-3 text-decoration-none"
        onClick={() => setIsSignUpPage((prev) => !prev)}
      >
        {isSignUpPage
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

export default Login;
