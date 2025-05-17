import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

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

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/me`, {
          withCredentials: true
        });
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.log("Not authenticated");
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
      await axios.post(`${backendUrl}/api/user/logout`, {}, {
        withCredentials: true
      });
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/user/me`, profileData, {
        withCredentials: true
      });
      if (data.success) {
        setUser(data.user);
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
