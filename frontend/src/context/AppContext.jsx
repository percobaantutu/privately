import { createContext, useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [teachers, setTeachers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const currencySymbol = "Rp";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") {
      amount = Number(amount) || 0;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");
  };

  const getTeachers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/teachers/list`);
      if (data.success) {
        setTeachers(data.teachers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Could not fetch teacher data.");
    }
  };

  const checkSession = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/me`);
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.log("No active session found.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${backendUrl}/api/auth/me`, profileData);
      if (response.data.success) {
        setUser(response.data.user);
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

  const logout = async () => {
    try {
      await axios.get(`${backendUrl}/api/auth/logout`);
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/notifications`);
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${backendUrl}/api/notifications/${notificationId}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n)));
    } catch (error) {
      toast.error("Failed to mark notification as read.");
    }
  };

  useEffect(() => {
    getTeachers();
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 30000);
      return () => clearInterval(intervalId);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const value = {
    user,
    setUser,
    loading,
    teachers,
    getTeachers,
    updateUserProfile,
    logout,
    backendUrl,
    currencySymbol,
    notifications,
    fetchNotifications,
    markAsRead,
    formatCurrency,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
