import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [teachers, setTeachers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Initialize token from localStorage
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
  }, []); // Fetch teachers on component mount

  const value = {
    teachers,
    currencySymbol,
    getTeachers,
    token,
    setToken,
    backendUrl,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
