// frontend/src/pages/Session.jsx

import { assets } from "@/assets/assets_frontend/assets";
import { Button } from "@/components/ui/button";
import RelatedTeachers from "@/components/ui/RelatedTeachers";
import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingConfirmation from "@/components/ui/BookingConfirmation";
import axios from "../utils/axios"; // Use configured axios
import { toast } from "react-toastify";
import { Star } from "lucide-react"; // Import the Star icon

function Session() {
  const { teacherId } = useParams();
  const { teachers, formatCurrency, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teacherSlots, setTeacherSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotTime, setSlotTime] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  // --- NEW STATE FOR REVIEWS ---
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // --- NEW FUNCTION TO FETCH REVIEWS ---
  const fetchTeacherReviews = async () => {
    if (!teacherId) return;
    setLoadingReviews(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/reviews/teacher/${teacherId}`);
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("Could not load teacher reviews.");
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchTeacherInfo = () => {
    const foundTeacher = teachers.find((teacher) => teacher._id === teacherId);
    setTeacherInfo(foundTeacher);
  };

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

  const handleSlotSelection = (slot) => {
    setSlotTime(slot.time);
    setSelectedSession({
      teacher: teacherInfo,
      // ✅ FIX: Use the reliable YYYY-MM-DD format instead of locale-dependent string
      date: slot.dateTime.toISOString().split("T")[0],
      time: slot.time,
      duration: 60,
      price: teacherInfo.fees,
    });
    setIsBookingModalOpen(true);
  };
  const handleBookingConfirm = async () => {
    setIsBookingModalOpen(false);

    try {
      const response = await axios.post(
        `${backendUrl}/api/bookings/create`,
        {
          teacherId: teacherInfo._id,
          date: selectedSession.date,
          startTime: selectedSession.time,
          duration: 60,
          type: "online",
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        const transactionToken = response.data.token;
        window.snap.pay(transactionToken, {
          onSuccess: function (result) {
            toast.success("Payment successful! Waiting for teacher confirmation.");
            navigate("/my-appointments");
          },
          onPending: function (result) {
            toast.info("Your payment is pending. We will update you shortly.");
            navigate("/my-appointments");
          },
          onError: function (result) {
            toast.error("Payment failed. Please try again.");
          },
          onClose: function () {
            toast.warn("You closed the payment popup without completing the payment.");
          },
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error creating booking";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (teachers.length > 0) {
      fetchTeacherInfo();
      fetchTeacherReviews();
    }
  }, [teachers, teacherId]);

  useEffect(() => {
    if (teacherInfo) {
      generateAvailableDates();
    }
  }, [teacherInfo]); // ✅ Dependency array is now correct.

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!teacherId || !selectedDate) return;

      setLoadingSlots(true);
      setTeacherSlots([]);

      const formattedDate = selectedDate.toISOString().split("T")[0];

      try {
        const { data } = await axios.get(`${backendUrl}/api/teachers/${teacherId}/slots/${formattedDate}`);
        if (data.success) {
          const formattedSlots = data.slots.map((time) => {
            const [hour, minute] = time.split(":");
            const dateTime = new Date(selectedDate);
            dateTime.setHours(hour, minute, 0, 0);
            return { time, dateTime };
          });
          setTeacherSlots(formattedSlots);
        }
      } catch (error) {
        toast.error("Could not fetch available slots for this day.");
        setTeacherSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    if (teacherInfo) {
      // Ensure teacherInfo is loaded before fetching slots
      fetchAvailableSlots();
    }
  }, [selectedDate, teacherId, teacherInfo, backendUrl]); // ✅ Added teacherInfo dependency

  if (!teacherInfo) {
    return <div className="text-center py-20">Loading teacher information...</div>;
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
            {teacherInfo.fullName} <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          {teacherInfo.rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-gray-700">{teacherInfo.rating}</span>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>
          )}
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
            Session fee: <span className="text-gray-800">{formatCurrency(teacherInfo.fees)}</span>
          </p>
        </div>
      </div>

      {/* Booking Section */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Select Date and Time</p>
        <div className="mt-4 flex flex-row gap-2 overflow-x-auto pb-2">
          {availableDates.map((date, index) => (
            <div
              key={index}
              onClick={() => {
                setSlotTime(""); // Reset selected time when date changes
                setSelectedDate(date);
              }}
              className={`text-center py-3 px-6 rounded-full cursor-pointer transition-all duration-300 flex-shrink-0 ${
                selectedDate.toDateString() === date.toDateString() ? "bg-primary text-white" : "border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              <p className="font-medium">{daysOfWeek[date.getDay()]}</p>
              <p className="text-sm">{date.getDate()}</p>
            </div>
          ))}
        </div>
        <div className="my-6 border-t border-gray-200"></div>
        <div className="mt-6">
          <p className="mb-4">Available Time Slots</p>
          <p className="mb-4 text-sm font-normal text-gray-500">All times are shown in Western Indonesia Time (WIB, UTC+7).</p>
          <div className="flex flex-wrap gap-3">
            {loadingSlots ? (
              <p className="text-sm text-gray-500">Finding available slots...</p>
            ) : teacherSlots.length > 0 ? (
              teacherSlots.map((item, index) => (
                <p
                  onClick={() => handleSlotSelection(item)}
                  key={index}
                  className={`text-sm font-light px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${
                    item.time === slotTime ? `bg-primary text-white` : `text-gray-400 border border-gray-300 hover:border-primary hover:text-primary`
                  }`}
                >
                  {item.time}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500">No available slots for this day.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Student Feedback</h3>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <img src={review.studentId.profilePicture} alt={review.studentId.fullName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-800">{review.studentId.fullName}</p>
                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                  ))}
                </div>
                {review.comment && <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">This teacher has no reviews yet.</p>
        )}
      </div>

      <BookingConfirmation isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} sessionDetails={selectedSession} onConfirm={handleBookingConfirm} />
      <RelatedTeachers speciality={teacherInfo.speciality} teacherId={teacherInfo._id} />
    </div>
  );
}

export default Session;
