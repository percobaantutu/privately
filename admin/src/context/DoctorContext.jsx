import { createContext } from "react";

export const DoctorContext = createContext();

export const DoctorContextProvider = (props) => {
  const value = {
    // Add any state or functions you want to provide to your components
  };

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
