// frontend/src/App.jsx
import "./App.css";
import React from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom"; // Added Outlet and useLocation
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
import TeacherDashboard from "./pages/TeacherDashboard"; // The component with sidebar + its own Outlet
import Profile from "./pages/TeacherDashboard/Profile";
import Availability from "./pages/TeacherDashboard/Availability";
import SessionsOverview from "./pages/TeacherDashboard/Sessions/index.jsx";
import SessionDetails from "./pages/TeacherDashboard/Sessions/SessionDetails.jsx";
import { ToastContainer } from "react-toastify"; // Removed toast from here, AppContext handles it
import 'react-toastify/dist/ReactToastify.css';

// Layout for regular site pages (with margins and footer)
const MainSiteLayout = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Outlet /> {/* Child routes will render here */}
      <Footer />
    </div>
  );
};

// Layout for Teacher Dashboard (full width, no site footer, includes Navbar)
const TeacherDashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen"> {/* Takes full viewport height */}
      <Navbar /> {/* Main site Navbar is rendered at the top */}
      {/* The TeacherDashboard component (with sidebar) will be rendered via the nested Outlet */}
      <div className="flex-1 overflow-hidden">
         <Outlet />
      </div>
      {/* No Footer here */}
    </div>
  );
};

function App() {
  // useLocation can be used here if needed for more complex conditional logic,
  // but the route structure itself will handle which layout to use.

  return (
    <>
      <Routes>
        {/* Routes using the MainSiteLayout */}
        <Route element={<MainSiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointments" element={<MySessions />} />
          <Route path="/session/:teacherId" element={<Session />} />
          <Route path="/teachers/:speciality" element={<Teachers />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/login" element={<Login />} />
          {/* Teacher login and register can use main site layout or be standalone */}
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/register" element={<TeacherRegister />} />
        </Route>

        {/* Routes using the TeacherDashboardLayout */}
        {/* The parent route for TeacherDashboardLayout renders the layout */}
        <Route element={<TeacherDashboardLayout />}>
          {/* The TeacherDashboard component itself becomes a child route of the layout */}
          {/* It will contain its own <Outlet> for its sub-pages (Profile, Sessions, etc.) */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />}>
            <Route index element={<Profile />} /> {/* Default for /teacher/dashboard */}
            <Route path="profile" element={<Profile />} />
            <Route path="availability" element={<Availability />} />
            <Route path="sessions" element={<SessionsOverview />} />
            <Route path="sessions/:sessionId" element={<SessionDetails />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </>
  );
}

export default App;