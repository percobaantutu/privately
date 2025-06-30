import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

export const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("adminToken") || "");
  const [teachers, setTeachers] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // UPDATED: Fetches from the new GET endpoint
  const getAllTeachers = async () => {
    if (!aToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-teachers`, { headers: { aToken } });
      if (data.success) {
        // The data structure now comes from the unified teacher list
        setTeachers(data.teachers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // UPDATED: This now toggles the 'isActive' status via the new PUT endpoint
  const changeAvailability = async (teacherId) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/admin/teacher-status`, { teacherId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllTeachers(); // Refresh the list to show the new status
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    getAllTeachers,
    teachers,
    setTeachers,
    changeAvailability,
  };

  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
