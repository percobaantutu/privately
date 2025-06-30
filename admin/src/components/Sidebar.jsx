// admin/src/components/Sidebar.jsx

import { assets } from "@/assets/assets";
import { AdminContext } from "@/context/AdminContext";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);

  return (
    <div className="min-h-screen bg-white border-r">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink to="/admin-dashboard" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
            <img src={assets.home_icon} alt="" />
            <p>Dashboard</p>
          </NavLink>
          <NavLink to="/appointments" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
            <img src={assets.appointment_icon} alt="" />
            <p>Appointments</p>
          </NavLink>
          <NavLink to="/add-teacher" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
            <img src={assets.add_icon} alt="" />
            <p>Add teacher</p>
          </NavLink>
          <NavLink to="/teacher-list" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
            <img src={assets.people_icon} alt="" />
            <p>Teacher list</p>
          </NavLink>

          <NavLink to="/verification" className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""}`}>
            <img src={assets.tick_icon} alt="" className="w-5" />
            <p>Verification</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
