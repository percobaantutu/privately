import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios"; // Ensure correct path to your axios instance
import { toast } from "react-toastify";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/teachers/profile", { // No need for full backendUrl if axios is configured
          withCredentials: true,
        });
        if (response.data.success) {
          setTeacher(response.data.teacher);
        } else {
          toast.error(response.data.message || "Failed to fetch profile");
          navigate("/teacher/login");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Session expired or invalid. Please login.");
        navigate("/teacher/login");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });
      navigate("/teacher/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Teacher Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/teacher/dashboard" // Or /teacher/dashboard/profile if that's the default
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive && (location.pathname === '/teacher/dashboard' || location.pathname === '/teacher/dashboard/profile')
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  Profile
                </Link>
                <Link
                  to="/teacher/dashboard/availability"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  Availability
                </Link>
                {/* === NEW SESSIONS LINK === */}
                <Link
                  to="/teacher/dashboard/sessions"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  Sessions
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{teacher?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            {/* Mobile menu button can go here if you have one */}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {teacher ? <Outlet context={{ teacher, setTeacher }} /> : null}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;