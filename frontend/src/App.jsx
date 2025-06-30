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
import TeacherLogin from "./pages/TeacherLogin";
import TeacherRegister from "./pages/TeacherRegister";
import TeacherDashboard from "./pages/TeacherDashboard";
import Profile from "./pages/TeacherDashboard/Profile";
import Availability from "./pages/TeacherDashboard/Availability";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sessions from "./pages/TeacherDashboard/Sessions";

function App() {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar></Navbar>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MySessions />} />
        <Route path="/session/:teacherId" element={<Session />} />
        <Route path="/teachers/:speciality" element={<Teachers />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/login" element={<Login />} />

        {/* Teacher Routes */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/register" element={<TeacherRegister />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="availability" element={<Availability />} />
          <Route path="sessions" element={<Sessions />} />
        </Route>
      </Routes>
      <ToastContainer />
      <Footer></Footer>
    </div>
  );
}

export default App;
