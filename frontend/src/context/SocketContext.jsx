import { createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import io from "socket.io-client";

const SocketContext = createContext();

// Get the backend URL directly from the environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // We still need the user from AppContext to know WHEN to connect
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      // Use the backendUrl constant defined at the top of the file
      const newSocket = io(backendUrl, {
        query: {
          userId: user._id,
        },
      });

      setSocket(newSocket);

      newSocket.on("get_online_users", (users) => {
        setOnlineUsers(users);
      });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]); // The dependency array no longer needs backendUrl

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
