// import { assets } from "@/assets/assets_frontend/assets";
// import { AppContext } from "@/context/AppContext";
// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// function Session() {
//   const { teacherId } = useParams();
//   const { teachers, currencySymbol } = useContext(AppContext);
//   const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   const [teacherInfo, setTeacherInfo] = useState(null);
//   const [teacherSlots, setTeacherSlots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = "";

//   const fetchTeacherInfo = async () => {
//     const teacherInfo = teachers.find((teacher) => teacher._id === teacherId);
//     setTeacherInfo(teacherInfo);
//   };

//   const getAvailableSlots = () => {
//     setTeacherSlots([]);
//     //getting current date
//     let today = new Date();

//     for (let i = 0; i < 7; i++) {
//       //getting date with index
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       //setting end time of the date with index
//       let endTime = new Date(currentDate);
//       endTime.setDate(endTime.getDate() + i);
//       endTime.setHours(21, 0, 0, 0);

//       //setting hours
//       if (today.getDate() === currentDate.getDate()) {
//         currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//       } else {
//         currentDate.setHours(10);
//         currentDate.setMinutes(0);
//       }

//       let timeSlot = [];

//       while (currentDate < endTime) {
//         let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//         // add slot to array
//         timeSlot.push({
//           dateTime: new Date(currentDate),
//           time: formattedTime,
//         });

//         //increment time by 30 minutes
//         currentDate.setMinutes(currentDate.getMinutes() + 30);
//       }
//       setTeacherSlots((prev) => [...prev, timeSlot]);
//     }
//   };

//   useEffect(() => {
//     fetchTeacherInfo();
//   }, [teachers, teacherId]);

//   useEffect(() => {
//     getAvailableSlots();
//   }, [teacherInfo]);

//   useEffect(() => {
//     console.log(teacherSlots);
//   }, [teacherSlots]);

//   return (
//     teacherInfo && (
//       <div>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div>
//             <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={teacherInfo.image} alt={teacherInfo.name} />
//           </div>
//           <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
//             <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
//               {teacherInfo.name} <img className="w-5" src={assets.verified_icon} alt="" />
//             </p>

//             <div className="flex items-center gap-2 mt-1 text-gray-600">
//               <p>{teacherInfo.degree}</p>
//               <button className="py-0.5 px-2 border text-xs rounded-full cursor-pointer">{teacherInfo.experience}</button>
//             </div>
//             <div>
//               <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
//                 About <img className="w-3" src={assets.info_icon} alt="" />
//               </p>
//               <p className="text-sm text-gray-600 max-w-[700px] mt-1">{teacherInfo.about}</p>
//             </div>
//             <p className="text-gray-600 font-medium mt-4">
//               Session fee:{" "}
//               <span className="text-gray-800">
//                 {currencySymbol}
//                 {teacherInfo.fees}
//               </span>{" "}
//             </p>
//           </div>
//         </div>
//         <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
//           <p>Booking Slots</p>
//           <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//             {teacherSlots.length &&
//               teacherSlots.map((item, index) => (
//                 <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer  ${slotIndex === index ? `bg-primary text-white` : `border border-gray-200`}`} key={index}>
//                   <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
//                   <p>{item[0] && item[0].dateTime.getDate()}</p>
//                 </div>
//               ))}
//           </div>
//           <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//             {teacherSlots.length &&
//               teacherSlots[slotIndex].map((item, index) => (
//                 <p
//                   onClick={() => setSlotTime(item.time)}
//                   key={index}
//                   className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? `bg-primary text-white` : `text-gray-400 border border-gray-300`}`}
//                 >
//                   {item.time.toLowerCase()}
//                 </p>
//               ))}
//           </div>
//         </div>
//       </div>
//     )
//   );
// }

// export default Session;

import { assets } from "@/assets/assets_frontend/assets";
import { Button } from "@/components/ui/button";
import RelatedTeachers from "@/components/ui/RelatedTeachers";
import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Session() {
  const { teacherId } = useParams();
  const { teachers, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teacherSlots, setTeacherSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState(""); // <-- Corrected this line

  // Fetch teacher info
  const fetchTeacherInfo = () => {
    const foundTeacher = teachers.find((teacher) => teacher._id === teacherId);
    setTeacherInfo(foundTeacher);
  };

  // Generate available time slots
  const getAvailableSlots = () => {
    const today = new Date();
    const slots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const daySlots = [];
      while (currentDate < endTime) {
        daySlots.push({
          dateTime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(daySlots);
    }

    setTeacherSlots(slots);
  };

  useEffect(() => {
    if (teachers.length) fetchTeacherInfo();
  }, [teachers, teacherId]);

  useEffect(() => {
    if (teacherInfo) getAvailableSlots();
  }, [teacherInfo]);

  if (!teacherInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading teacher information...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={teacherInfo.image} alt={teacherInfo.name} />
        </div>

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {teacherInfo.name} <img className="w-5" src={assets.verified_icon} alt="" />
          </p>

          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{teacherInfo.degree}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full cursor-pointer">{teacherInfo.experience}</button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
              About <img className="w-3" src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">{teacherInfo.about}</p>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Session fee:{" "}
            <span className="text-gray-800">
              {currencySymbol}
              {teacherInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots Section */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Booking Slots</p>

        {/* Days of the week */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {teacherSlots.map((daySlots, index) => (
            <div key={index} onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-primary text-white" : "border border-gray-200"}`}>
              <p>{daySlots[0] && daysOfWeek[daySlots[0].dateTime.getDay()]}</p>
              <p>{daySlots[0] && daySlots[0].dateTime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Available times */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {teacherSlots[slotIndex]?.map((slot, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(slot.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${slot.time === slotTime ? "bg-primary text-white" : "text-gray-400 border border-gray-300"}`}
            >
              {slot.time.toLowerCase()}
            </p>
          ))}
        </div>
        <Button className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">Book a session</Button>
      </div>
      <RelatedTeachers teacherId={teacherId} speciality={teacherInfo.speciality} />
    </div>
  );
}

export default Session;
