import React, { useState, useEffect, useContext } from "react";
import axios from "../../../utils/axios"; // Adjust path if your axios instance is elsewhere
import { toast } from "react-toastify";
import SessionList from "./SessionList";
import { AppContext } from "../../../context/AppContext"; // Adjust path

const SessionsOverview = () => {
  const { backendUrl } = useContext(AppContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backendUrl}/api/teacher/sessions`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setSessions(response.data.sessions);
        } else {
          toast.error(response.data.message || "Failed to fetch sessions.");
          setError(response.data.message || "Failed to fetch sessions.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "An error occurred while fetching sessions.");
        setError(err.response?.data?.message || "An error occurred.");
        console.error("Fetch sessions error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [backendUrl]);

  if (loading) return <div className="text-center p-10">Loading sessions...</div>;
  if (error) return <div className="text-red-500 p-4 text-center">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Sessions</h2>
        {/* Button to create session can be added here later */}
      </div>
      <SessionList sessions={sessions} />
    </div>
  );
};
export default SessionsOverview;