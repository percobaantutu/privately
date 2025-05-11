import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/AppContext";
import React, { useContext } from "react";

function MySessions() {
  const { teachers } = useContext(AppContext);

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">My Sessions</p>
      <div>
        {teachers.slice(0, 4).map((item, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b" key={index}>
            <div>
              <img src={item.image} className="w-32 bg-indigo-50" alt="" />
            </div>
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">{item.name}</p>
              <p>{item.speciality}</p>
              <p className="text-[#464646] font-medium mt-1">Address:</p>
              <p>{item.address.line1}</p>
              <p>{item.address.line2}</p>
              <p>
                Date & time: <span className="text-sm text-[#3C3C3C] font-medium">25, july, 2025 - 10:00 AM</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end text-sm text-center">
              <Button className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">Pay Online</Button>
              <Button className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">Cancel</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MySessions;
