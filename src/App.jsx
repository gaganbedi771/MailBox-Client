import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";

const App = () => {
  return (
    <>
    <Header></Header>
      <Routes>
        <Route path="/" element={<Login></Login>} />
      </Routes>
    </>
  );
};

export default App;
