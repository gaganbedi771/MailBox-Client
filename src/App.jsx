import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./components/Home";

const App = () => {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/home" element={<Home></Home>} />
      </Routes>
    </>
  );
};

export default App;
