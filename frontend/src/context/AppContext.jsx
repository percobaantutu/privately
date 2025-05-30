// frontend/src/context/AppContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios"; // Assuming this is your pre-configured axios instance from utils/axios.js
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [teachers, setTeachers] = useState([]);
  // The 'token' state might not be strictly necessary for auth if relying on HTTP-only cookies,
  // but keeping it for now as it was in your original code.
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const currencySymbol = "$";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const updateUserProfile = async (profileData) => {
    console.log("Attempting to update user profile with data:", profileData);
    try {
      // Determine the correct endpoint based on user role
      const endpoint = user?.role === 'teacher'
        ? `${backendUrl}/api/teachers/profile`
        : `${backendUrl}/api/auth/me`;

      const response = await axios.put(endpoint, profileData, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Ensure the user object from response includes the role
        const updatedUser = user?.role === 'teacher' ? response.data.teacher : response.data.user;
        setUser({ ...updatedUser, role: user.role }); // Preserve the role explicitly
        toast.success("Profile updated successfully!");
        return true;
      } else {
        toast.error(response.data.message || "Failed to update profile.");
        return false;
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "An error occurred while updating profile.");
      return false;
    }
  };

  const getTeachers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/teachers/list`);
      if (data.success) {
        setTeachers(data.teachers);
        // Consider removing this toast or making it less frequent if it's annoying
        // toast.success("Teachers fetched successfully!");
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

    const checkSession = async () => {
      let sessionIsValid = false;
      let activeUser = null;

      // 1. Try to authenticate as a general user/student
      try {
        const { data: studentData } = await axios.get(`${backendUrl}/api/auth/me`, {
          withCredentials: true,
        });
        if (studentData.success && studentData.user) {
          activeUser = { ...studentData.user, role: studentData.user.role || 'student' };
          sessionIsValid = true;
        }
      } catch (studentError) {
        console.warn("Student session check failed (might be a teacher or no session):", studentError.response?.data?.message || studentError.message);
      }

      // 2. If not authenticated as a student, try to authenticate as a teacher
      if (!sessionIsValid) {
        try {
          const { data: teacherData } = await axios.get(`${backendUrl}/api/teachers/profile`, {
            withCredentials: true,
          });
          if (teacherData.success && teacherData.teacher) {
            activeUser = { ...teacherData.teacher, role: 'teacher' }; // Explicitly set role
            sessionIsValid = true;
          }
        } catch (teacherError) {
          console.warn("Teacher session check failed (or no session):", teacherError.response?.data?.message || teacherError.message);
        }
      }

      // 3. Set the user state based on validation
      setUser(activeUser);
    };

    checkSession();

  }, [backendUrl]); // Added backendUrl to dependency array

  const value = {
    teachers,
    currencySymbol,
    getTeachers,
    token, // Kept token as per original, though its role in auth might be minimal with cookies
    setToken,
    backendUrl,
    user,
    setUser,
    updateUserProfile,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;