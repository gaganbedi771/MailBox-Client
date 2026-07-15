import { createContext } from "react";
import { useState } from "react";

const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  userEmail: "",
  loginHandler: (token) => {},
  logoutHandler: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const initialEmail = localStorage.getItem("userEmail");

  const [token, setToken] = useState(initialToken);

  const [userEmail, setUserEmail] = useState(initialEmail);
  const isLoggedIn = !!token;
  const loginHandler = (token, email) => {
    setToken(token);
    setUserEmail(email);
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
  };

  const logoutHandler = () => {
    setToken(null);
    setUserEmail("");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
  };

  const contextValue = {
    token,
    userEmail,
    isLoggedIn,
    loginHandler,
    logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
