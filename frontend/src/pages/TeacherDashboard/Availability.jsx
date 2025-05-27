import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Availability = () => {
  const { teacher } = useOutletContext();
  const [available, setAvailable] = useState(teacher?.available || false);

  const handleToggleAvailability = async () => {
    try {
      const response = await axios.put(
        "/api/teacher/availability",
        { available: !available },
        { withCredentials: true }
      );

      if (response.data.success) {
        setAvailable(response.data.available);
        toast.success(
          response.data.available
            ? "You are now available for sessions"
            : "You are now unavailable for sessions"
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update availability");
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Availability Management</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Control your availability for teaching sessions.
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Current Status</h4>
            <p className="mt-1 text-sm text-gray-500">
              {available
                ? "You are currently available for teaching sessions"
                : "You are currently unavailable for teaching sessions"}
            </p>
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              available
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {available ? "Set Unavailable" : "Set Available"}
          </button>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900">Availability Guidelines</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li>• When available, students can book sessions with you</li>
            <li>• When unavailable, no new sessions can be booked</li>
            <li>• Existing sessions will not be affected by your availability status</li>
            <li>• You can change your availability at any time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Availability; 