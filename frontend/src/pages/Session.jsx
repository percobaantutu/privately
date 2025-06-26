import { assets } from "@/assets/assets_frontend/assets";
import { Button } from "@/components/ui/button";
import RelatedTeachers from "@/components/ui/RelatedTeachers";
import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingConfirmation from "@/components/ui/BookingConfirmation";
import axios from "axios";
import { toast } from "react-toastify";

function Session() {
  const { teacherId } = useParams();
  console.log("FRONTEND: teacherId from URL is:", teacherId);
  const { teachers, currencySymbol, backendUrl } = useContext(AppContext);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teacherSlots, setTeacherSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotTime, setSlotTime] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  // Fetch teacher info
  const fetchTeacherInfo = () => {
    const foundTeacher = teachers.find((teacher) => teacher._id === teacherId);
    setTeacherInfo(foundTeacher);
  };

  // Generate available dates (today + next 6 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    setAvailableDates(dates);
  };

  // Generate available time slots
  const getAvailableSlots = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 6); // Maximum 6 days in advance

    // Set time range (10 AM to 9 PM)
    const startHour = 10;
    const endHour = 21;

    const slots = [];
    const currentDate = new Date(selectedDate);
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    // Only generate slots if the selected date is within the allowed range
    if (currentDate >= today && currentDate <= maxDate) {
      const endTime = new Date(selectedDate);
      endTime.setHours(endHour, 0, 0, 0);

      // For today, start from the next hour if current time is past start hour
      if (currentDate.getTime() === today.getTime()) {
        const now = new Date();
        const currentHour = now.getHours();
        currentDate.setHours(Math.max(currentHour + 1, startHour), 0, 0, 0);
      } else {
        currentDate.setHours(startHour, 0, 0, 0);
      }

      while (currentDate < endTime) {
        slots.push({
          dateTime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        currentDate.setHours(currentDate.getHours() + 1); // 60-minute slots
      }
    }

    // Debug log
    setTeacherSlots(slots);
  };

  const handleSlotSelection = (slot) => {
    setSlotTime(slot.time);
    setSelectedSession({
      teacher: teacherInfo,
      date: slot.dateTime.toLocaleDateString(),
      time: slot.time,
      duration: 60,
      price: teacherInfo.fees,
    });
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/bookings/create`,
        {
          teacherId: teacherInfo._id,
          date: selectedSession.date,
          startTime: selectedSession.time,
          duration: selectedSession.duration,
          type: "online",
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Booking confirmed successfully!");
        setIsBookingModalOpen(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error creating booking";
      toast.error(errorMessage);
      console.error("Booking failed:", error);
    }
  };

  useEffect(() => {
    if (teachers.length) fetchTeacherInfo();
  }, [teachers, teacherId]);

  useEffect(() => {
    if (teacherInfo) {
      generateAvailableDates();
      getAvailableSlots();
    }
  }, [teacherInfo, selectedDate]);

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

      {/* Booking Section */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Select Date and Time</p>

        {/* Date Selection */}
        <div className="mt-4 flex flex-row gap-2 overflow-x-auto pb-2">
          {availableDates.map((date, index) => (
            <div
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`text-center py-3 px-6 rounded-full cursor-pointer transition-all duration-300 flex-shrink-0 ${
                selectedDate.toDateString() === date.toDateString() ? "bg-primary text-white" : "border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              <p className="font-medium">{daysOfWeek[date.getDay()]}</p>
              <p className="text-sm">{date.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Time slots */}
        <div className="mt-6">
          <p className="mb-4">Available Time Slots</p>
          <div className="flex flex-wrap gap-3">
            {teacherSlots.map((item, index) => (
              <p
                onClick={() => handleSlotSelection(item)}
                key={index}
                className={`text-sm font-light px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${
                  item.time === slotTime ? `bg-primary text-white` : `text-gray-400 border border-gray-300 hover:border-primary hover:text-primary`
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmation isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} sessionDetails={selectedSession} onConfirm={handleBookingConfirm} />
    </div>
  );
}

export default Session;
