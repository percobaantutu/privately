// frontend/src/components/ui/Navbar.jsx
import React, { useContext, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./button";
import { assets } from "@/assets/assets_frontend/assets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import axios from "../../utils/axios"; // Make sure path is correct
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, backendUrl } = useContext(AppContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // THIS IS YOUR MAIN NAVBAR'S HEIGHT - MUST MATCH THE VALUE IN TeacherDashboard.jsx
  const MAIN_NAVBAR_HEIGHT_CLASS = "h-[65px]"; // e.g., h-[65px] for 65px height
  const MAIN_NAVBAR_HEIGHT_PX = 65; // The numeric value for calculations

  const isTeacherDashboardRoute = location.pathname.startsWith("/teacher/dashboard");

  const logout = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUser(null);
        toast.success("Logged out successfully!");
        if (user?.role === 'teacher') {
            navigate("/teacher/login");
        } else {
            navigate("/login");
        }
      } else {
        toast.error(response.data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const dispatchToggleTeacherSidebar = () => {
    document.dispatchEvent(new CustomEvent('toggleTeacherSidebar'));
  };

  return (
    <div className={`flex justify-between items-center border-gray-200 border-b py-2 mb-0 px-4 md:px-0 sticky top-0 bg-white z-50 ${MAIN_NAVBAR_HEIGHT_CLASS}`}>
      <div className="flex items-center gap-2">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="privately logo"
          className="w-32 sm:w-36 cursor-pointer"
        />
        {user && user.role === 'teacher' && isTeacherDashboardRoute && (
          <span className="ml-1 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white bg-primary rounded-full">
            Teacher
          </span>
        )}
      </div>

      {(!user || user.role !== 'teacher' || !isTeacherDashboardRoute) && (
        <ul className="hidden md:flex items-center justify-between gap-5 text-sm lg:text-base font-medium text-gray-600">
          <NavLink to="/" className={({isActive}) => isActive ? "text-primary font-semibold" : "hover:text-primary"}>Home</NavLink>
          <NavLink to="/teachers" className={({isActive}) => isActive ? "text-primary font-semibold" : "hover:text-primary"}>All Teachers</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "text-primary font-semibold" : "hover:text-primary"}>About</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? "text-primary font-semibold" : "hover:text-primary"}>Contact</NavLink>
        </ul>
      )}
      {/* Spacer for when main nav is hidden on teacher dashboard */}
      {(user && user.role === 'teacher' && isTeacherDashboardRoute) && <div className="hidden md:block flex-grow"></div>}


      <div className="flex gap-3 items-center">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer group p-1 rounded-md hover:bg-gray-100 transition-colors">
                <img
                  src={user.image || assets.profile_pic || "/default-profile.png"}
                  alt={user.name || "User"}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-300 group-hover:border-primary transition-colors"
                />
                <span className="hidden lg:inline text-sm font-medium text-gray-700 group-hover:text-primary">{user.name}</span>
                <img src={assets.dropdown_icon} alt="dropdown" className="w-2.5 opacity-70 group-hover:opacity-100" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 mr-2 sm:mr-0 shadow-lg border-gray-200">
              <DropdownMenuGroup>
                {user.role === 'teacher' ? (
                  <DropdownMenuItem onClick={() => navigate("/teacher/dashboard/profile")}>Teacher Profile</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/my-profile")}>My Profile</DropdownMenuItem>
                )}
                {user.role !== 'teacher' && (
                    <DropdownMenuItem onClick={() => navigate("/my-appointments")}>My Appointments</DropdownMenuItem>
                )}
                 {user.role === 'teacher' && ( // Link to teacher's sessions overview
                    <DropdownMenuItem onClick={() => navigate("/teacher/dashboard/sessions")}>My Sessions</DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="!text-red-600 hover:!bg-red-50 focus:!bg-red-50 font-medium">
                <LogOut size={16} className="mr-2"/> Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            className="bg-primary text-sm rounded-full hidden md:inline-flex py-2 px-5 shadow hover:bg-primary/90"
          >
            Login / Sign Up
          </Button>
        )}

        {/* Mobile Menu Button - Logic to show correct one */}
        {isTeacherDashboardRoute && user && user.role === 'teacher' ? (
             // Hamburger for Teacher Dashboard Sidebar on Mobile
            <button onClick={dispatchToggleTeacherSidebar} className="p-2 rounded-md md:hidden text-gray-600 hover:bg-gray-100">
                 <Menu size={24} />
            </button>
        ) : (
            // Hamburger for Main Site Navigation on Mobile
            <button onClick={toggleMobileMenu} className="p-2 rounded-md md:hidden text-gray-600 hover:bg-gray-100">
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
        )}
      </div>

      {/* Mobile Menu for Student/Guest View (Main Site Nav) */}
      <AnimatePresence>
        {showMobileMenu && (!isTeacherDashboardRoute || !user || user.role !== 'teacher') && (
          <>
            <motion.div /* Backdrop */ />
            <motion.div /* Menu Content */>
              {/* ... Same mobile menu content as before for student/guest ... */}
              <div className="flex items-center justify-between mb-6">
                <img src={assets.logo} className="w-32" alt="logo" onClick={() => {navigate("/"); toggleMobileMenu();}}/>
                <button onClick={toggleMobileMenu}><X size={28} /></button>
              </div>
              <ul className="flex flex-col gap-3 text-base font-medium">
                <NavLink to="/" onClick={toggleMobileMenu} className={({ isActive }) => (isActive ? "bg-primary text-white px-4 py-2.5 rounded-lg" : "text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100")}>Home</NavLink>
                <NavLink to="/teachers" onClick={toggleMobileMenu} className={({ isActive }) => (isActive ? "bg-primary text-white px-4 py-2.5 rounded-lg" : "text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100")}>All Teachers</NavLink>
                <NavLink to="/about" onClick={toggleMobileMenu} className={({ isActive }) => (isActive ? "bg-primary text-white px-4 py-2.5 rounded-lg" : "text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100")}>About</NavLink>
                <NavLink to="/contact" onClick={toggleMobileMenu} className={({ isActive }) => (isActive ? "bg-primary text-white px-4 py-2.5 rounded-lg" : "text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100")}>Contact</NavLink>
                {!user && (
                    <Button onClick={() => {navigate("/login"); toggleMobileMenu();}} className="w-full mt-5 bg-primary text-white py-3 text-base">
                        Login / Sign Up
                    </Button>
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
export default Navbar;