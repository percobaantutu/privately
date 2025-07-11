import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Appointments from "./pages/Admin/Appointments.jsx";
import AddTeacher from "./pages/Admin/AddTeacher.jsx";
import TeacherList from "./pages/Admin/TeacherList.jsx";
import Verification from "./pages/Admin/Verification";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/add-teacher" element={<AddTeacher />} />
          <Route path="/teacher-list" element={<TeacherList />} />
          <Route path="/verification" element={<Verification />} />
        </Routes>
      </div>
    </div>
  ) : (
    <div className="">
      <Login />
      <ToastContainer />
    </div>
  );
};

export default App;
