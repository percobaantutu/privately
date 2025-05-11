// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { Button } from "./button";
// import { assets } from "@/assets/assets_frontend/assets";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// function Navbar() {
//   const navigate = useNavigate();

//   const [token, setToken] = useState(true);
//   const [showMenu, setShowMenu] = useState(false);

//   return (
//     <div className="flex justify-between items-center border-gray-400 border-b py-2 mb-5">
//       <img onClick={() => navigate("/")} src={assets.logo} alt="privately logo" className="w-36 cursor-pointer" />
//       <ul className="hidden md:flex justify-between gap-4 text-md font-semibold">
//         <NavLink to="/">
//           <li className="py-1">Home</li>
//           <hr className="border-none outline-none h-0.5 w-3/5 bg-primary m-auto hidden " />
//         </NavLink>
//         <NavLink to="/teachers">
//           <li className="py-1">All Teachers</li>
//           <hr className="border-none outline-none h-0.5 w-3/5 bg-primary m-auto hidden " />
//         </NavLink>
//         <NavLink to="/about">
//           <li className="py-1">About us</li>
//           <hr className="border-none outline-none h-0.5 w-3/5 bg-primary m-auto hidden " />
//         </NavLink>
//         <NavLink to="/contact">
//           <li className="py-1">Contact</li>
//           <hr className="border-none outline-none h-0.5 w-3/5 bg-primary m-auto hidden " />
//         </NavLink>
//       </ul>
//       <div className="flex gap-4 items-center">
//         {token ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <div className="flex items-center gap-2 cursor-pointer group relative">
//                 <img src={assets.profile_pic} alt="user" className="w-10 h-10 rounded-full" />
//                 <img src={assets.dropdown_icon} alt="user" className="w-2.5" />
//               </div>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56">
//               <DropdownMenuGroup>
//                 <DropdownMenuItem onClick={() => navigate("/my-profile")}>My Profile</DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => navigate("/my-appointments")}>My Appointment</DropdownMenuItem>
//               </DropdownMenuGroup>
//               <DropdownMenuSeparator />

//               <DropdownMenuItem onClick={() => setToken(false)}>Log out</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : (
//           <Button onClick={() => navigate("/login")} className="bg-primary text-md rounded-full hidden md:block py-2 px-4">
//             Create Account
//           </Button>
//         )}

//         <img  onClick={() => setShowMenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="" />
//         <div class="md:hidden fixed w-full right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all"><div class="flex items-center justify-between px-5 py-6"><img src="/assets/logo-BNCDj_dh.svg" class="w-36" alt=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACZ0lEQVR4nO3cy27TQBSA4RPKRT6T9iG4qUW8CEgUWHQB7Chh0cwE3iAPCuIiqOAlsNG4GFqpFnGaNudk/k+aXRY5+jXjyI4sAgAAAAAAAAAAAAAA1mB+XXaO7sr29L6IjMSt+TUZx912ljyTSyG9khC/S0jNn/VFqvhMvKlmzyXEr//miN8kTF+KvxipPhWjW7VonIgXGie9c4T4QpwYSUjH5wzhK4r2xujWsY9jOF8v+ofwEUX/G+Nkbc/uiXk76c4CQexG0QVj5HXr/W1xYCQaP7qMogNiaPrg48jKdPZYQvzlKooOiJFn0/hIXNH0elCUcTxa33eNh26+68ZH0VJieIiipcWwHEVLjWExipYew1IUJYadKEoMO1GUGHaiKDHsRFFi2ImixLATRYlhJ4oSw04UJYadKEoMO1GUGIYeGKV60GctPBArYKc0a7s/VhRdWRRiGIpSszPsRKmJYSdKTYzLpIN+2hLEWIyGKPZiNESxF6Mhir0YDVEuHmPCrRMrdIkbhRb+YrSR9AJ3bYliKEaHKCuyyucZyvFlJ0aHKEu6zCd9yk6xE6NDlAVd5TNwZafYidEhSo91/jtE2Sl2YnSIYihGp/golmJI6VEsxig2iuUYxUXxEKOYKFV6uvEvn6mm++LDwVb7fkVPMZaL8rmd1bz89k7PW18HHF8u3igXZg/dxhgaZfxuT+yb3xSNP90cU8sfXz/aWV3Q9Kb3YughxpkoPTsl7yJXcpSzO+WTVOmJeFNN99sL+Omd4S7GX29vyDg9OHnVuIdfJH0OttoZ8ix5JgAAAAAAAAAAAAAAIFftNzm+PJEnw4B9AAAAAElFTkSuQmCC" class="w-7" alt=""></div><ul class="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium"><a class="active" href="/" aria-current="page"><p class="px-4 py-2 rounded full inline-block">HOME</p></a><a class="" href="/doctors"><p class="px-4 py-2 rounded full inline-block">ALL DOCTORS</p></a><a class="" href="/about"><p class="px-4 py-2 rounded full inline-block">ABOUT</p></a><a class="" href="/contact"><p class="px-4 py-2 rounded full inline-block">CONTACT</p></a></ul></div>

//       </div>
//     </div>
//   );
// }

// export default Navbar;

import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { assets } from "@/assets/assets_frontend/assets";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AppContext } from "@/context/AppContext";

function Navbar() {
  const navigate = useNavigate();

  const { token, setToken } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="flex justify-between items-center border-gray-400 border-b py-2 mb-5 px-4 md:px-0">
      <img onClick={() => navigate("/")} src={assets.logo} alt="privately logo" className="w-36 cursor-pointer" />

      {/* Desktop Menu */}
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

      {/* Right Side */}
      <div className="flex gap-4 items-center">
        {token ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer group relative">
                <img src={assets.profile_pic} alt="user" className="w-10 h-10 rounded-full" />
                <img src={assets.dropdown_icon} alt="dropdown" className="w-2.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/my-profile")}>My Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-appointments")}>My Appointment</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout;
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => navigate("/login")} className="bg-primary text-md rounded-full hidden md:block py-2 px-4">
            Create Account
          </Button>
        )}

        {/* Mobile Menu Button */}
        <button onClick={() => setShowMenu(!showMenu)} className="md:hidden">
          {showMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* AnimatePresence for smooth enter/exit */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-20" onClick={() => setShowMenu(false)} />

            {/* Mobile Slide Menu */}
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
