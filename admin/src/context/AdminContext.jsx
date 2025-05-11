import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

export const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("adminToken") ? localStorage.getItem("adminToken") : "");

  const [teachers, setTeachers] = useState([]); // State to store teachers data

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllTeachers = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/all-teachers`, {}, { headers: { aToken } });
      if (data.success) {
        setTeachers(data.teachers);
        console.log(data.teachers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (teacherId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { teacherId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllTeachers();
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
