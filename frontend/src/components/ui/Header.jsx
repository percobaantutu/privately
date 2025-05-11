import React from "react";
import { assets } from "@/assets/assets_frontend/assets";
import { Button } from "./button";
import { FaArrowRight } from "react-icons/fa6";

function Header() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 ">
      <div className="md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white text-left">Book a session with Professional Teachers</h2>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img src={assets.group_profiles} alt="group profiles" className="w-28" />
          <p className="text-sm text-white text-center md:text-left">Simply browse through our extensive list of professional teachers, schedule your learning session in flexible way.</p>
        </div>
        <a href="#speciality">
          <Button variant="default" className="bg-white text-primary p-4 rounded-full cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-secondary hover:text-white">
            Book a session
            <FaArrowRight className="w-3" />
          </Button>
        </a>
      </div>
      <div className="md:w-1/2 relative">
        <img src={assets.header_img} alt="privately teachers" className="w-full md:absolute bottom-0 h-auto rounded-lg" />
      </div>
    </div>
  );
}

export default Header;
