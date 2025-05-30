// frontend/src/pages/TeacherDashboard/index.jsx
import { useState, useEffect, useContext } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axios"; // Ensure this path is correct for your configured axios
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext"; // Ensure this path is correct
import { Menu, X, User, CalendarDays, BookOpenText, LogOut } from "lucide-react"; // Removed Settings icon for now
import { assets } from "@/assets/assets_frontend/assets"; // For the logo in mobile sidebar

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: globalUser, setUser: setGlobalUser } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // THIS IS YOUR MAIN NAVBAR'S HEIGHT - ADJUST IT ACCURATELY
  const MAIN_NAVBAR_HEIGHT_PX = 65; // Example: 65px. Measure yours!

  useEffect(() => {
    const fetchTeacherProfileIfNeeded = async () => {
      if (globalUser && globalUser.role === 'teacher') {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get("/api/teachers/profile", {
          withCredentials: true,
        });
        if (response.data.success) {
          const fetchedTeacher = { ...response.data.teacher, role: 'teacher' };
          setGlobalUser(fetchedTeacher);
        } else {
          // toast.error(response.data.message || "Authentication failed.");
          navigate("/teacher/login");
        }
      } catch (error) {
        // toast.error(error.response?.data?.message || "Session may have expired. Please login.");
        navigate("/teacher/login");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfileIfNeeded();
  }, [globalUser, navigate, setGlobalUser]);

  useEffect(() => {
    // Listener for the main navbar to toggle this sidebar on mobile
    const handleToggleTeacherSidebar = () => setIsSidebarOpen(prev => !prev);
    document.addEventListener('toggleTeacherSidebar', handleToggleTeacherSidebar);
    return () => {
      document.removeEventListener('toggleTeacherSidebar', handleToggleTeacherSidebar);
    };
  }, []);


  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });
      setGlobalUser(null);
      toast.success("Logged out successfully!");
      navigate("/teacher/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const sidebarLinks = [
    { name: "Profile", path: "/teacher/dashboard/profile", icon: <User size={20} /> },
    { name: "My Sessions", path: "/teacher/dashboard/sessions", icon: <BookOpenText size={20} /> },
    { name: "Availability", path: "/teacher/dashboard/availability", icon: <CalendarDays size={20} /> },
  ];

  const isActiveLink = (path) => {
    const currentBasePath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
    const linkBasePath = path.endsWith('/') ? path.slice(0, -1) : path;

    if (linkBasePath === "/teacher/dashboard/profile" && (currentBasePath === "/teacher/dashboard" )) {
        return true;
    }
    return currentBasePath === linkBasePath || currentBasePath.startsWith(linkBasePath + "/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: `calc(100vh - ${MAIN_NAVBAR_HEIGHT_PX}px)` }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="ml-4 text-lg text-gray-600">Loading Teacher Dashboard...</p>
      </div>
    );
  }

  if (!globalUser || globalUser.role !== 'teacher') {
    return <div className="text-center p-10" style={{ minHeight: `calc(100vh - ${MAIN_NAVBAR_HEIGHT_PX}px)` }}>Redirecting to login...</div>;
  }

  const SidebarNavContent = () => ( // Renamed to avoid confusion with main Navbar component
    <nav className="mt-6 space-y-1.5"> {/* Adjusted spacing */}
      {sidebarLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          onClick={() => isSidebarOpen && setIsSidebarOpen(false)} // Close mobile sidebar on link click
          className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ease-in-out group
            ${
              isActiveLink(link.path)
                ? "bg-primary text-white shadow-sm" // Active link style
                : "text-gray-600 hover:bg-indigo-100 hover:text-primary" // Inactive link style
            }`}
        >
          <span className="mr-3 opacity-80 group-hover:opacity-100">{link.icon}</span>
          {link.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex" style={{ height: `calc(100vh - ${MAIN_NAVBAR_HEIGHT_PX}px)` }}>
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden" // Darker backdrop
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out 
                   lg:static lg:translate-x-0 
                   top-[${MAIN_NAVBAR_HEIGHT_PX}px] lg:top-0 
                   h-[calc(100vh-${MAIN_NAVBAR_HEIGHT_PX}px)] lg:h-full 
                  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b lg:hidden"> {/* Mobile sidebar header with logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={assets.logo} alt="Privately" className="w-28" />
              <span className="px-2 py-0.5 text-xs font-semibold text-white bg-primary rounded-full">Teacher</span>
            </Link>
          </div>
          <div className="flex-grow px-3 py-4 overflow-y-auto"> {/* Adjusted padding */}
            <SidebarNavContent />
          </div>
          <div className="p-3 border-t border-gray-200"> {/* Adjusted padding */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 ease-in-out group"
            >
              <LogOut size={18} className="mr-3 opacity-70 group-hover:opacity-100" /> {/* Adjusted icon size */}
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content area needs padding-top on mobile to not be hidden by the fixed main Navbar */}
        <main
            className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8"
            style={{ paddingTop: `calc(${MAIN_NAVBAR_HEIGHT_PX}px + 1rem)`, paddingBottom: '1rem' }} // Dynamic padding for mobile
        >
          <div style={{ marginTop: `-${MAIN_NAVBAR_HEIGHT_PX}px` }} className="lg:mt-0"> {/* Negative margin for lg to counteract padding, remove padding for lg */}
             <Outlet context={{ teacher: globalUser }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;