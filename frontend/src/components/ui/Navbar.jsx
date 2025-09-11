import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { assets } from "@/assets/assets_frontend/assets";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import NotificationBell from "./NotificationBell";

function Navbar({ isTeacherView = false }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [navSearchTerm, setNavSearchTerm] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Function to handle search submission from the navbar
  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearchTerm.trim()) {
      navigate(`/teachers?search=${navSearchTerm.trim()}`);
      setNavSearchTerm(""); // Clear the input after search
      setShowMenu(false); // Close mobile menu on search
    }
  };

  return (
    <div className={`flex justify-between items-center border-b py-2 mb-5 ${isTeacherView ? "px-4 md:px-8" : "px-4 md:px-0"}`}>
      <div className="flex items-center gap-2">
        <img onClick={() => navigate("/")} src={assets.logo} alt="privately logo" className="w-36 cursor-pointer" />
        {isTeacherView && <span className="text-gray-400 font-light text-xl tracking-wider hidden sm:block">Teacher</span>}
      </div>

      {!user || user.role !== "teacher" ? (
        <ul className="hidden lg:flex justify-between items-center gap-4 text-md font-semibold">
          <NavLink to="/">
            <li className="py-1">Home</li>
          </NavLink>
          {/* Global Search Bar - Desktop */}
          <li className="hidden md:block">
            <form onSubmit={handleNavSearch} className="relative">
              <input
                type="text"
                value={navSearchTerm}
                onChange={(e) => setNavSearchTerm(e.target.value)}
                placeholder="Search for a teacher..."
                className="border rounded-full px-4 py-1.5 w-64 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </form>
          </li>
          <NavLink to="/teachers">
            <li className="py-1">All Teachers</li>
          </NavLink>
          <NavLink to="/about">
            <li className="py-1">About us</li>
          </NavLink>
          <NavLink to="/contact">
            <li className="py-1">Contact</li>
          </NavLink>
        </ul>
      ) : (
        <div className="hidden md:block"></div>
      )}

      <div className="flex gap-2 sm:gap-4 items-center">
        {user ? (
          <>
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer group relative">
                  {/* FIX: Changed user.image to user.profilePicture */}
                  <img src={user.profilePicture || assets.profile_pic} alt="user" className="w-10 h-10 rounded-full object-cover" />
                  <img src={assets.dropdown_icon} alt="dropdown" className="w-2.5 hidden sm:block" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/my-profile")}>My Profile</DropdownMenuItem>
                  {user.role === "teacher" ? (
                    <DropdownMenuItem onClick={() => navigate("/teacher/dashboard")}>Teacher Dashboard</DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/my-appointments")}>My Sessions</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/my-disputes")}>My Disputes</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button onClick={() => navigate("/login")} className="bg-primary text-md rounded-full hidden md:block py-2 px-4">
            Create Account
          </Button>
        )}

        <button onClick={() => setShowMenu(!showMenu)} className="lg:hidden">
          {showMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-20" onClick={() => setShowMenu(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 right-0 bottom-0 w-3/4 max-w-xs bg-white z-30 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <img src={assets.logo} className="w-32" alt="logo" />
                <button onClick={() => setShowMenu(false)}>
                  <X size={28} />
                </button>
              </div>
              {/* Global Search Bar - Mobile */}
              <form onSubmit={handleNavSearch} className="relative mb-4">
                <input
                  type="text"
                  value={navSearchTerm}
                  onChange={(e) => setNavSearchTerm(e.target.value)}
                  placeholder="Search for a teacher..."
                  className="border rounded-full px-4 py-2 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </form>

              {/* --- CORRECTED SECTION --- */}
              {!user || user.role !== "teacher" ? (
                <ul className="flex flex-col gap-2 text-lg font-medium">
                  <NavLink to="/" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    <li className="px-2 py-2 hover:bg-gray-100 rounded-lg">Home</li>
                  </NavLink>
                  <NavLink to="/teachers" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    <li className="px-2 py-2 hover:bg-gray-100 rounded-lg">All Teachers</li>
                  </NavLink>
                  <NavLink to="/about" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    <li className="px-2 py-2 hover:bg-gray-100 rounded-lg">About us</li>
                  </NavLink>
                  <NavLink to="/contact" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    <li className="px-2 py-2 hover:bg-gray-100 rounded-lg">Contact</li>
                  </NavLink>
                  <NavLink to="/login" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
                    <li className="px-2 py-2 hover:bg-gray-100 rounded-lg">Sign up/ Login</li>
                  </NavLink>
                </ul>
              ) : (
                <ul className="flex flex-col gap-4 text-lg font-medium">
                  <NavLink
                    to="/teacher/dashboard/profile"
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) => (isActive ? "bg-primary text-white font-semibold px-4 py-2 rounded-lg" : "text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100")}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/teacher/dashboard/sessions"
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) => (isActive ? "bg-primary text-white font-semibold px-4 py-2 rounded-lg" : "text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100")}
                  >
                    My Sessions
                  </NavLink>
                  <NavLink
                    to="/teacher/dashboard/availability"
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) => (isActive ? "bg-primary text-white font-semibold px-4 py-2 rounded-lg" : "text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100")}
                  >
                    Availability
                  </NavLink>
                  <NavLink
                    to="/teacher/dashboard/earnings"
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) => (isActive ? "bg-primary text-white font-semibold px-4 py-2 rounded-lg" : "text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100")}
                  >
                    Earnings
                  </NavLink>
                  <hr className="my-4" />
                  <button onClick={handleLogout} className="text-red-500 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 text-left">
                    Logout
                  </button>
                </ul>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
