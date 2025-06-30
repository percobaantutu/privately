// frontend/src/pages/TeacherDashboard/Sessions.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { AppContext } from "@/context/AppContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
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
    if (!user) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/bookings/teacher`);
      if (data.success) {
        setSessions(data.bookings);
      }
    } catch (error) {
      toast.error("Failed to fetch sessions.");
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleCompleteSession = async (sessionId) => {
    try {
      const response = await axios.put(`${backendUrl}/api/bookings/${sessionId}/complete`);
      if (response.data.success) {
        toast.success("Session marked as complete!");
        fetchSessions(); // Refresh the list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark session as complete.");
    }
  };

  const handleOpenConfirmModal = (sessionId) => {
    setModalState({ isOpen: true, sessionId, isLoading: false });
  };

  const handleCloseConfirmModal = () => {
    setModalState({ isOpen: false, sessionId: null, isLoading: false });
  };

  const handleConfirmSession = async (sessionLink) => {
    setModalState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await axios.put(`${backendUrl}/api/bookings/${modalState.sessionId}/confirm`, {
        sessionLink,
      });

      if (response.data.success) {
        toast.success("Session confirmed successfully!");
        handleCloseConfirmModal();
        fetchSessions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm session.");
    } finally {
      setModalState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const renderSessionCard = (session, type) => (
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
      <div className="w-full sm:w-auto mt-2 sm:mt-0 flex flex-col sm:flex-row gap-2">
        {type === "pending" && (
          <Button onClick={() => handleOpenConfirmModal(session._id)} className="w-full sm:w-auto bg-primary">
            Confirm Booking
          </Button>
        )}
        {type === "upcoming" && (
          <>
            <a href={session.sessionLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Join Session
              </Button>
            </a>
            <Button onClick={() => handleCompleteSession(session._id)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              Mark as Complete
            </Button>
          </>
        )}
        {type === "past" && <span className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${session.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{session.status}</span>}
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center p-8">Loading sessions...</div>;
  }

  const pendingSessions = sessions.filter((s) => s.status === "pending_confirmation");
  const upcomingSessions = sessions.filter((s) => s.status === "confirmed");
  const pastSessions = sessions.filter((s) => s.status === "completed" || s.status === "cancelled");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Pending Confirmation</h2>
        {pendingSessions.length > 0 ? <div className="space-y-4">{pendingSessions.map((session) => renderSessionCard(session, "pending"))}</div> : <p className="text-gray-500">You have no new session requests.</p>}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Upcoming Sessions</h2>
        {upcomingSessions.length > 0 ? <div className="space-y-4">{upcomingSessions.map((session) => renderSessionCard(session, "upcoming"))}</div> : <p className="text-gray-500">You have no upcoming sessions.</p>}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Past Sessions</h2>
        {pastSessions.length > 0 ? <div className="space-y-4">{pastSessions.map((session) => renderSessionCard(session, "past"))}</div> : <p className="text-gray-500">You have no past sessions.</p>}
      </div>

      <ConfirmationModal isOpen={modalState.isOpen} onClose={handleCloseConfirmModal} onConfirm={handleConfirmSession} isLoading={modalState.isLoading} />
    </div>
  );
};

export default Sessions;
