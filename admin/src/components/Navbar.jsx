import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { assets } from "../assets/assets";
import { Button } from "./ui/button";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAToken(null);
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <img src={assets.logo} alt="" className="w-36 cursor-pointer" />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">{aToken ? "Admin" : "Doctor"}</p>
      </div>
      <Button onClick={logout} className="bg-primary">
        Logout
      </Button>
    </div>
  );
};

export default Navbar;
