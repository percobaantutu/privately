// frontend/src/pages/TeacherDashboard/Availability.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { AppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

const Availability = () => {
  const { backendUrl } = useContext(AppContext);
  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  // Generates time slots from 08:00 to 21:00
  const timeSlots = Array.from({ length: 14 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/teachers/me/availability`);
        if (data.success) {
          setSchedule(data.availability || {});
        }
      } catch (error) {
        toast.error("Failed to load your schedule.");
        console.error("Fetch schedule error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [backendUrl]);

  const handleSlotToggle = (day, time) => {
    setSchedule((prev) => {
      const daySlots = prev[day] ? [...prev[day]] : [];
      const index = daySlots.indexOf(time);

      if (index > -1) {
        daySlots.splice(index, 1); // Remove slot if it exists
      } else {
        daySlots.push(time); // Add slot if it doesn't exist
        daySlots.sort(); // Keep the array of times sorted
      }
      return { ...prev, [day]: daySlots };
    });
  };

  const handleSaveSchedule = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/teachers/me/availability`, { availability: schedule });
      if (data.success) {
        toast.success("Schedule updated successfully!");
        setSchedule(data.availability);
      }
    } catch (error) {
      toast.error("Failed to save schedule.");
      console.error("Save schedule error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && Object.keys(schedule).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Set Your Weekly Availability</h1>
      <p className="text-gray-600 mb-6">
        Select the hours you are available for tutoring each week. <span className="font-semibold text-primary">All times are shown in Western Indonesia Time (WIB, UTC+7).</span>.
      </p>
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {days.map((day) => (
          <div key={day}>
            <h3 className="font-semibold text-lg mb-3 text-gray-700 border-b pb-2">{day}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
              {timeSlots.map((time) => {
                const isSelected = schedule[day] && schedule[day].includes(time);
                return (
                  <button
                    key={time}
                    onClick={() => handleSlotToggle(day, time)}
                    className={`p-2 rounded-lg text-sm border transition-colors duration-200 ${isSelected ? "bg-primary text-white border-primary font-semibold" : "bg-gray-50 text-gray-700 hover:border-primary hover:text-primary"}`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleSaveSchedule} disabled={isLoading} className="mt-6 bg-primary px-8 py-3">
        {isLoading ? "Saving..." : "Save Schedule"}
      </Button>
    </div>
  );
};

export default Availability;
