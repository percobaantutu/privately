// frontend/src/layouts/TeacherDashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/ui/Navbar'; // Main site Navbar

const TeacherDashboardLayout = () => {
  // This layout assumes the Navbar is sticky and has a fixed height.
  // The actual TeacherDashboard component (with sidebar + content) will be rendered via <Outlet />
  // and will handle its own height calculations relative to the Navbar.

  return (
    <div className="flex flex-col h-screen"> {/* Full viewport height */}
      <Navbar /> {/* Main site Navbar will be at the top */}
      <div className="flex-1 overflow-hidden"> {/* This container will hold the TeacherDashboard component */}
        <Outlet /> {/* TeacherDashboard/index.jsx and its children will render here */}
      </div>
      {/* NO FOOTER HERE */}
    </div>
  );
};

export default TeacherDashboardLayout;