// frontend/src/pages/TeacherDashboard/index.jsx

import { useContext, useEffect } from "react"; // ✅ Make sure useEffect is imported
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { User, Users, CalendarCheck2, DollarSign, LogOut } from "lucide-react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading: isAppLoading } = useContext(AppContext);

  // ✅ FIX: The navigation logic is now inside a useEffect hook.
  useEffect(() => {
    // This effect runs when the app's loading status changes or the user state changes.
    if (!isAppLoading && !user) {
      toast.error("You must be logged in to view the dashboard.");
      navigate("/teacher/login");
    }
  }, [user, isAppLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    // The AppContext logout function should handle navigation or state change that triggers the effect above.
  };

  const navLinks = [
    { to: "/teacher/dashboard/profile", icon: <User size={20} />, text: "Profile" },
    { to: "/teacher/dashboard/sessions", icon: <Users size={20} />, text: "My Sessions" },
    { to: "/teacher/dashboard/availability", icon: <CalendarCheck2 size={20} />, text: "Availability" },
    { to: "/teacher/dashboard/earnings", icon: <DollarSign size={20} />, text: "Earnings" },
  ];

  // While the app context is loading the user, show a loading spinner.
  if (isAppLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-85px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we're done loading but there's no user, we render null and the useEffect will handle the redirect.
  // This prevents rendering the dashboard for a split second before redirecting.
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-85px)] bg-gray-100">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white border-r flex-shrink-0 hidden md:flex md:flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-primary">Teacher Dashboard</h2>
        </div>
        <nav className="mt-4 flex-1 flex flex-col justify-between">
          <div>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors ${isActive ? "bg-primary/10 text-primary font-semibold border-r-4 border-primary" : "border-r-4 border-transparent"}`
                }
              >
                {link.icon}
                <span>{link.text}</span>
              </NavLink>
            ))}
          </div>
          <div className="p-4 border-t">
            <button onClick={handleLogout} className="flex items-center gap-4 w-full px-2 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default TeacherDashboard;
