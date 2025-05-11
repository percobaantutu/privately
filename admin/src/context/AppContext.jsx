import { createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const value = {
    // Add any state or functions you want to provide to your components
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
