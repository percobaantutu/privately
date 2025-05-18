import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Function to set user state and persist to localStorage
  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  // Fetch teachers on mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/teachers/list`);
        setTeachers(data.teachers || []);
      } catch (error) {
        toast.error("Failed to load teachers");
      }
    };
    fetchTeachers();
  }, [backendUrl]);

  // Check authentication status on mount and load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }

    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/me`, {
          withCredentials: true
        });
        if (data.success) {
          setUser(data.user); // Use the wrapper function to also update localStorage
        } else {
           setUser(null); // Clear state and localStorage if backend auth fails
        }
      } catch (error) {
        console.log("Not authenticated or session expired.", error);
        setUser(null); // Clear state and localStorage on error
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [backendUrl]);

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const logout = async () => {
    try {
      await axios.get(`${backendUrl}/api/auth/logout`, {
        withCredentials: true
      });
      setUser(null); // Clear state and localStorage
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/auth/me`, profileData, {
        withCredentials: true
      });
      if (data.success) {
        setUser(data.user); // Update state and localStorage
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        backendUrl,
        logout,
        teachers,
        updateUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
