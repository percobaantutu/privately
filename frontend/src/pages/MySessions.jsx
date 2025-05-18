import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MySessions() {
  const { backendUrl } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/bookings/user`, {
        withCredentials: true,
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/bookings/${bookingId}/cancel`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings(); // Refresh the bookings list
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to cancel booking";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading your sessions...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">My Sessions</p>
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have any sessions booked yet.</p>
          <Button
            className="mt-4 bg-primary text-white"
            onClick={() => navigate("/teachers")}
          >
            Find a Teacher
          </Button>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
              key={booking._id}
            >
              <div>
                <img
                  src={booking.teacherId.image}
                  className="w-32 bg-indigo-50"
                  alt={booking.teacherId.name}
                />
              </div>
              <div className="flex-1 text-sm text-[#5E5E5E]">
                <p className="text-[#262626] text-base font-semibold">
                  {booking.teacherId.name}
                </p>
                <p>{booking.teacherId.speciality}</p>
                <p className="text-[#464646] font-medium mt-1">Session Details:</p>
                <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                <p>Time: {booking.startTime} - {booking.endTime}</p>
                <p>Status: <span className={`font-medium ${
                  booking.status === 'confirmed' ? 'text-green-600' :
                  booking.status === 'cancelled' ? 'text-red-600' :
                  booking.status === 'completed' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>{booking.status}</span></p>
              </div>
              <div className="flex flex-col gap-2 justify-end text-sm text-center">
                {booking.status === 'pending' && (
                  <>
                    <Button
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                      onClick={() => navigate(`/session/${booking.teacherId._id}`)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <Button
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-green-600 hover:text-white transition-all duration-300"
                  >
                    Join Session
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MySessions;
