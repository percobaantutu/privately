import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MySessions from "./pages/MySessions";
import Session from "./pages/Session";
import Teachers from "./pages/Teachers";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-sessions" element={<MySessions />} />
        <Route path="/session/:teacherId" element={<Session />} />
        <Route path="/teachers/:speciality" element={<Teachers />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
