// frontend/src/context/AppContext.jsx

import { createContext, useEffect, useState } from "react";
import axios from "../utils/axios"; // Assuming you have this configured
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [teachers, setTeachers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To track initial app load

  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- Fetch All Verified Teachers ---
  // This now expects the new data structure from the aggregation pipeline.
  const getTeachers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/teachers/list`);
      if (data.success) {
        setTeachers(data.teachers);
        // No toast message here for a better user experience on load.
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Could not fetch teacher data.");
    }
  };

  // --- Check for an existing session on app load ---
  const checkSession = async () => {
    try {
      // The /me endpoint now correctly identifies any logged-in user
      const { data } = await axios.get(`${backendUrl}/api/auth/me`);
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      // This is expected if the user is not logged in, so no toast.
      console.log("No active session found.");
      setUser(null);
    } finally {
      // We are done loading, whether we found a user or not.
      setLoading(false);
    }
  };

  // --- Update User Profile ---
  // This function should still work as it targets /api/auth/me which updates the User model
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${backendUrl}/api/auth/me`, profileData);
      if (response.data.success) {
        setUser(response.data.user); // Update state with the returned user object
        toast.success("Profile updated successfully!");
        setLoading(false);
        return true;
      } else {
        toast.error(response.data.message || "Failed to update profile.");
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating profile.");
      setLoading(false);
      return false;
    }
  };

  // --- Logout ---
  const logout = async () => {
    try {
      await axios.get(`${backendUrl}/api/auth/logout`);
      setUser(null); // Clear the user state
      toast.success("Logged out successfully!");
      // Navigation will be handled in the component that calls logout.
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Run on initial application load
  useEffect(() => {
    // Fetch initial data
    getTeachers();
    checkSession();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    teachers,
    getTeachers,
    updateUserProfile,
    logout, // Provide the logout function to the context
    backendUrl,
    currencySymbol,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
