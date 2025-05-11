import { assets } from "@/assets/assets_frontend/assets";
import React from "react";

const About = () => {
  return (
    <div>
      {/* About Us Section */}
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          ABOUT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={assets.about_image} alt="About Us" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Hey there, welcome to Privately— where learning meets a little extra fun! 🎉 We know that finding the right tutor and keeping up with lessons can feel like a lot, but don’t worry — we’re here to make it super easy and totally
            stress-free.
          </p>
          <p>
            At Privately, we’re always leveling up our platform to give you a smoother, more awesome experience. Whether you're booking your very first session or you’re already on your way to becoming a pro, Prescripto’s got your back
            every step of the way. Let’s make learning an adventure!
          </p>

          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision at Privately is to create a seamless learning experience for every student. We aim to bridge the gap between learners and amazing tutors, making it easier for you to get the help you need, exactly when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>EFFICIENCY:</b>
          <p>Smooth and easy lesson booking that fits perfectly into your busy schedule.</p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>CONVENIENCE:</b>
          <p>Instant access to a network of trusted tutors, ready to help you learn and grow.</p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>PERSONALIZATION:</b>
          <p>Smart recommendations and friendly reminders to keep your learning journey on track.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
