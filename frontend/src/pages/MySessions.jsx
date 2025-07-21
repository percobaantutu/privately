// frontend/src/pages/MySessions.jsx

import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReviewModal from "@/components/ui/ReviewModal";
import CancellationModal from "@/components/ui/CancellationModal";
import DisputeModal from "@/components/ui/DisputeModal"; // Import the new DisputeModal

function MySessions() {
  const { backendUrl } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewedSessions, setReviewedSessions] = useState(new Set());

  // Cancellation Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState(null);
  const [cancellationInfo, setCancellationInfo] = useState({ message: "" });
  const [isCancelling, setIsCancelling] = useState(false);

  // Dispute Modal State
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeSessionId, setDisputeSessionId] = useState(null);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/bookings/user`);
      if (data.success) {
        setBookings(data.bookings);
        checkReviewedSessions(data.bookings);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // --- Cancellation Logic ---
  const handleOpenCancelModal = (booking) => {
    const sessionTime = new Date(booking.date).getTime();
    const now = new Date().getTime();
    const hoursUntil = (sessionTime - now) / (1000 * 60 * 60);

    let info = {};
    if (hoursUntil > 24) {
      info.message = "You are cancelling more than 24 hours in advance. You will receive a full refund.";
    } else if (hoursUntil >= 2 && hoursUntil <= 24) {
      info.message = "You are cancelling between 2 and 24 hours before the session. You will receive a 50% refund.";
    } else {
      info.message = "You are cancelling less than 2 hours before the session. This cancellation is not eligible for a refund.";
    }

    setSessionToCancel(booking);
    setCancellationInfo(info);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setSessionToCancel(null);
  };

  const confirmCancellation = async () => {
    if (!sessionToCancel) return;
    setIsCancelling(true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/bookings/${sessionToCancel._id}/cancel`, {});
      if (data.success) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
      handleCloseCancelModal();
    }
  };

  // --- Review Logic ---
  const checkReviewedSessions = async (bookingsToCheck) => {
    const completedSessions = bookingsToCheck.filter((b) => b.status === "completed");
    const reviewed = new Set();
    for (const session of completedSessions) {
      try {
        const { data } = await axios.get(`${backendUrl}/api/reviews/session/${session._id}/exists`);
        if (data.success && data.exists) {
          reviewed.add(session._id);
        }
      } catch (error) {
        console.error(`Could not check review status for session ${session._id}`, error);
      }
    }
    setReviewedSessions(reviewed);
  };

  const handleOpenReviewModal = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedSessionId(null);
    setIsReviewModalOpen(false);
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!selectedSessionId) return;
    setIsSubmittingReview(true);
    try {
      const response = await axios.post(`${backendUrl}/api/reviews/session/${selectedSessionId}`, { rating, comment });
      if (response.data.success) {
        toast.success("Review submitted successfully!");
        handleCloseReviewModal();
        setReviewedSessions((prev) => new Set(prev).add(selectedSessionId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // --- Dispute Logic ---
  const handleOpenDisputeModal = (sessionId) => {
    setDisputeSessionId(sessionId);
    setIsDisputeModalOpen(true);
  };

  const handleCloseDisputeModal = () => {
    setDisputeSessionId(null);
    setIsDisputeModalOpen(false);
  };

  const handleDisputeSubmit = async ({ reason, details }) => {
    if (!disputeSessionId) return;
    setIsSubmittingDispute(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/disputes/session/${disputeSessionId}`, { reason, details });
      if (data.success) {
        toast.success(data.message);
        handleCloseDisputeModal();
        // Optionally, refetch bookings to show a "Dispute Filed" status if you add one
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit dispute.");
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "pending_confirmation":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <>
      <ReviewModal isOpen={isReviewModalOpen} onClose={handleCloseReviewModal} onSubmit={handleReviewSubmit} isLoading={isSubmittingReview} />
      <CancellationModal isOpen={isCancelModalOpen} onClose={handleCloseCancelModal} onConfirm={confirmCancellation} isLoading={isCancelling} cancellationInfo={cancellationInfo} />
      <DisputeModal isOpen={isDisputeModalOpen} onClose={handleCloseDisputeModal} onSubmit={handleDisputeSubmit} isLoading={isSubmittingDispute} />
      <div>
        <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">My Sessions</p>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">You don't have any sessions booked yet.</p>
            <Button className="mt-4 bg-primary text-white" onClick={() => navigate("/teachers")}>
              Find a Teacher
            </Button>
          </div>
        ) : (
          <div>
            {bookings.map((booking) => (
              <div className="grid grid-cols-[1fr_2fr] sm:grid-cols-[100px_1fr_auto] gap-4 py-4 border-b items-center" key={booking._id}>
                <img src={booking.teacherId.profilePicture} className="w-24 h-24 object-cover rounded-lg bg-indigo-50" alt={booking.teacherId.fullName} />
                <div className="flex-1 text-sm text-[#5E5E5E]">
                  <p className="text-[#262626] text-base font-semibold">{booking.teacherId.fullName}</p>
                  <p className="text-gray-500">{booking.teacherId.speciality}</p>
                  <p className="mt-1">Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p>Time: {booking.startTime}</p>
                  <p>
                    Status: <span className={`font-medium capitalize px-2 py-0.5 rounded-full text-xs ${getStatusClass(booking.status)}`}>{booking.status.replace("_", " ")}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 justify-end text-sm text-center col-span-2 sm:col-span-1">
                  {booking.status === "confirmed" && (
                    <a href={booking.sessionLink} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Join Session</Button>
                    </a>
                  )}

                  {(booking.status === "pending_confirmation" || booking.status === "confirmed") && (
                    <Button variant="destructive" className="w-full" onClick={() => handleOpenCancelModal(booking)}>
                      Cancel Booking
                    </Button>
                  )}

                  {booking.status === "completed" && !reviewedSessions.has(booking._id) && (
                    <Button variant="outline" className="w-full" onClick={() => handleOpenReviewModal(booking._id)}>
                      Leave a Review
                    </Button>
                  )}

                  {(booking.status === "completed" || booking.status === "confirmed") && (
                    <Button variant="link" className="text-xs text-gray-500" onClick={() => handleOpenDisputeModal(booking._id)}>
                      Report an Issue
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MySessions;
