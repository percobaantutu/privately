import { assets } from "@/assets/assets_frontend/assets";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="Logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Our vision at Privately is to create a seamless learning experience for every student. We aim to bridge the gap between learners and amazing tutors, making it easier for you to get the help you need, exactly when you need it.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="cursor-pointer hover:underline">
              <Link to="/">Home</Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/about">About us</Link>
            </li>

            <li className="cursor-pointer hover:underline">
              <Link to="/terms-of-service">Terms of Service</Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/privacy-policy">Privacy policy</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+62 821-2845-9689</li>
            <li>restumhmmad27@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2025 @ Restu Muhammad - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
