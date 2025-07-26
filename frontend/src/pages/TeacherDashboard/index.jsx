// File: frontend/src/pages/TeacherDashboard/index.jsx

import { useContext, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { User, Users, CalendarCheck2, DollarSign, LogOut, AlertTriangle, Edit } from "lucide-react";

// Onboarding Banner Component
const OnboardingBanner = ({ onNavigate }) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex items-start sm:items-center gap-3">
      <AlertTriangle className="h-6 w-6 flex-shrink-0" />
      <div>
        <p className="font-bold">Action Required: Complete Your Profile</p>
        <p className="text-sm">Please add your bank and verification details to become eligible for payouts.</p>
      </div>
    </div>
    <button onClick={onNavigate} className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition-colors w-full sm:w-auto flex-shrink-0">
      <Edit size={16} />
      Update Profile
    </button>
  </div>
);

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading: isAppLoading } = useContext(AppContext);

  // Logic to check if profile is incomplete for payouts
  const isProfileIncomplete = user && (!user.teacherProfile?.bankDetails?.accountNumber || !user.teacherProfile?.verificationDetails?.idNumber);

  useEffect(() => {
    if (!isAppLoading && !user) {
      toast.error("You must be logged in to view the dashboard.");
      navigate("/teacher/login");
    }
  }, [user, isAppLoading, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { to: "/teacher/dashboard/profile", icon: <User size={20} />, text: "Profile" },
    { to: "/teacher/dashboard/sessions", icon: <Users size={20} />, text: "My Sessions" },
    { to: "/teacher/dashboard/availability", icon: <CalendarCheck2 size={20} />, text: "Availability" },
    { to: "/teacher/dashboard/earnings", icon: <DollarSign size={20} />, text: "Earnings" },
  ];

  if (isAppLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-85px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        {isProfileIncomplete && <OnboardingBanner onNavigate={() => navigate("/teacher/dashboard/profile")} />}
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default TeacherDashboard;
