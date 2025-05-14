import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

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

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        backendUrl,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
