// frontend/src/pages/TeacherDashboard/Sessions.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { AppContext } from "@/context/AppContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal"; // Import the modal
import { Button } from "@/components/ui/button";

const Sessions = () => {
  const { backendUrl, user } = useContext(AppContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    sessionId: null,
    isLoading: false,
  });

  const fetchSessions = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/sessions/teacher`);
      if (data.success) {
        setSessions(data.bookings); // Backend uses 'bookings' key
      }
    } catch (error) {
      toast.error("Failed to fetch sessions.");
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const handleOpenConfirmModal = (sessionId) => {
    setModalState({ isOpen: true, sessionId, isLoading: false });
  };

  const handleCloseConfirmModal = () => {
    setModalState({ isOpen: false, sessionId: null, isLoading: false });
  };

  const handleConfirmSession = async (sessionLink) => {
    setModalState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await axios.put(`${backendUrl}/api/sessions/${modalState.sessionId}/confirm`, {
        sessionLink,
      });

      if (response.data.success) {
        toast.success("Session confirmed successfully!");
        handleCloseConfirmModal();
        fetchSessions(); // Refresh the list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm session.");
    } finally {
      setModalState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const renderSessionCard = (session, isPending = false) => (
    <div key={session._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <img src={session.studentId.profilePicture} alt={session.studentId.fullName} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-gray-800">{session.studentId.fullName}</p>
          <p className="text-sm text-gray-600">
            {new Date(session.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} at {session.startTime}
          </p>
        </div>
      </div>
      <div className="w-full sm:w-auto mt-2 sm:mt-0">
        {isPending ? (
          <Button onClick={() => handleOpenConfirmModal(session._id)} className="w-full sm:w-auto bg-primary">
            Confirm Booking
          </Button>
        ) : (
          <a href={session.sessionLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full sm:w-auto">
              Join Session
            </Button>
          </a>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center p-8">Loading sessions...</div>;
  }

  const pendingSessions = sessions.filter((s) => s.status === "pending_confirmation");
  const upcomingSessions = sessions.filter((s) => s.status === "confirmed" && new Date(s.date) >= new Date());
  const pastSessions = sessions.filter((s) => s.status === "completed" || s.status === "cancelled" || new Date(s.date) < new Date());

  return (
    <div className="space-y-8">
      {/* Pending Confirmation Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Pending Confirmation</h2>
        {pendingSessions.length > 0 ? <div className="space-y-4">{pendingSessions.map((session) => renderSessionCard(session, true))}</div> : <p className="text-gray-500">You have no new session requests.</p>}
      </div>

      {/* Upcoming Sessions Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Upcoming Sessions</h2>
        {upcomingSessions.length > 0 ? <div className="space-y-4">{upcomingSessions.map((session) => renderSessionCard(session, false))}</div> : <p className="text-gray-500">You have no upcoming sessions.</p>}
      </div>

      {/* Past Sessions Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Past Sessions</h2>
        {pastSessions.length > 0 ? (
          <div className="space-y-4">
            {pastSessions.map((session) => (
              <div key={session._id} className="bg-gray-50 p-4 rounded-lg opacity-70">
                <p className="font-semibold">{session.studentId.fullName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(session.date).toLocaleDateString()} - <span className="capitalize">{session.status}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no past sessions.</p>
        )}
      </div>

      {/* The Modal */}
      <ConfirmationModal isOpen={modalState.isOpen} onClose={handleCloseConfirmModal} onConfirm={handleConfirmSession} isLoading={modalState.isLoading} />
    </div>
  );
};

export default Sessions;
