import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./components/Home";
import Compose from "./components/Compose";
import AuthContext from "./store/authContext";
import { useContext } from "react";
import ViewEmail from "./components/UI/ViewEmail";



const App = () => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={authCtx.isLoggedIn ? <Home></Home> :  <Login></Login>} />
        <Route path="/home" element={authCtx.isLoggedIn ? <Home></Home> : <Login></Login>} />
        <Route path="/compose" element={authCtx.isLoggedIn ? <Compose></Compose> : <Login></Login>} />
        <Route path="/email/:id" element={authCtx.isLoggedIn ? <ViewEmail></ViewEmail> : <Login></Login>} />
      </Routes>
    </>
  );
};

export default App;
