import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [teachers, setTeachers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Initialize token from localStorage
  const [user, setUser] = useState(null); // Add user state
  const currencySymbol = "$";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getTeachers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/teachers/list`);
      if (data.success) {
        setTeachers(data.teachers);
        toast.success("Teachers fetched successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getTeachers();
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/me`, {
          withCredentials: true, // Important for sending cookie
        });
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null); // Clear user if session is invalid
        }
      } catch (error) {
        // If the session check fails (e.g., no valid cookie), user remains null
        console.error("Session check failed:", error);
        setUser(null); // Ensure user is null on error
      }
    };

    checkSession();

  }, []); // Fetch teachers and check session on component mount

  const value = {
    teachers,
    currencySymbol,
    getTeachers,
    token,
    setToken,
    backendUrl,
    user, // Include user state
    setUser, // Include setUser function
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
