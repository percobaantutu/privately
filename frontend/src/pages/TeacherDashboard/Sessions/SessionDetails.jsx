import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../../utils/axios"; // Adjust path
import { AppContext } from "../../../context/AppContext"; // Adjust path
import { toast } from "react-toastify";

const SessionDetails = () => {
  const { sessionId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${backendUrl}/api/teacher/sessions/${sessionId}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setSession(response.data.session);
        } else {
          toast.error(response.data.message || "Failed to load session details.");
          setError(response.data.message || "Failed to load session details.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching session details.");
        setError(err.response?.data?.message || "An error occurred.");
        console.error("Fetch session details error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionDetails();
  }, [sessionId, backendUrl]);

  if (loading) return <div className="text-center p-10">Loading session details...</div>;
  if (error) return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
  if (!session) return <div className="text-center p-10">Session not found.</div>;

  const getStatusPillClasses = (status) => {
      // ... (same as in SessionCard)
      switch (status) {
        case "confirmed": return "bg-green-100 text-green-800";
        case "completed": return "bg-blue-100 text-blue-800";
        case "cancelled_by_student":
        case "cancelled_by_teacher":
        case "cancelled_by_admin":
          return "bg-red-100 text-red-800";
        case "pending_confirmation": return "bg-yellow-100 text-yellow-800";
        default: return "bg-gray-100 text-gray-800";
      }
  };
  const formattedDate = new Date(session.date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-700">{session.topic}</h2>
        <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${getStatusPillClasses(session.status)}`}>
            {session.status.replace(/_/g, " ").toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Student Details</h3>
          <div className="flex items-center space-x-3">
            <img
              src={session.studentId?.image || '/default-profile.png'}
              alt={session.studentId?.name || "Student"}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
            />
            <div>
              <p className="font-medium text-lg">{session.studentId?.name || 'N/A'}</p>
              <p className="text-sm text-gray-500">{session.studentId?.email || 'N/A'}</p>
              {/* We'll add more student details in Phase 4 */}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Session Information</h3>
          <p><strong>Date:</strong> {formattedDate}</p>
          <p><strong>Time:</strong> {session.startTime} - {session.endTime}</p>
          <p><strong>Duration:</strong> {session.duration} minutes</p>
          <p><strong>Fee:</strong> ${session.price}</p>
        </div>
      </div>
      
      {/* Placeholder for notes, reviews, messaging - to be added in later phases */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Session Actions & Info</h3>
        <p className="text-gray-500 italic">
          (More actions like adding notes, viewing reviews, and messaging will be available here in future phases.)
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link to="/teacher/dashboard/sessions" className="text-indigo-600 hover:underline">
          &larr; Back to All Sessions
        </Link>
      </div>
    </div>
  );
};
export default SessionDetails;