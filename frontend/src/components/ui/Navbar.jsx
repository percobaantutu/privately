import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { assets } from "@/assets/assets_frontend/assets";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, user, setUser, backendUrl } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(null);
        toast.success("Logged out successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Logout failed on server.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };

  return (
    <div className="flex justify-between items-center border-gray-400 border-b py-2 mb-5 px-4 md:px-0">
      <img onClick={() => navigate("/")} src={assets.logo} alt="privately logo" className="w-36 cursor-pointer" />

      <ul className="hidden md:flex justify-between gap-4 text-md font-semibold">
        <NavLink to="/">
          <li className="py-1">Home</li>
        </NavLink>
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

      <div className="flex gap-4 items-center">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer group relative">
                <img src={user.image || assets.profile_pic || "/default-profile.png"} alt="user" className="w-10 h-10 rounded-full" />
                <img src={assets.dropdown_icon} alt="dropdown" className="w-2.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/my-profile")}>My Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-appointments")}>My Appointment</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => navigate("/login")} className="bg-primary text-md rounded-full hidden md:block py-2 px-4">
            Create Account
          </Button>
        )}

        <button onClick={() => setShowMenu(!showMenu)} className="md:hidden">
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
              <ul className="flex flex-col gap-4 text-lg font-medium">
                <NavLink to="/" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "bg-primary text-white font-semibold px-4 py-2 rounded-lg" : "text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100")}>
                  Home
                </NavLink>
                <NavLink to="/teachers" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "bg-primary text-white font-semibold px-4 py-2 rounded-lg" : "text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100")}>
                  All Teachers
                </NavLink>
                <NavLink to="/about" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "bg-primary text-white font-semibold px-4 py-2 rounded-lg" : "text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100")}>
                  About
                </NavLink>
                <NavLink to="/contact" onClick={() => setShowMenu(false)} className={({ isActive }) => (isActive ? "bg-primary text-white font-semibold px-4 py-2 rounded-lg" : "text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100")}>
                  Contact
                </NavLink>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
