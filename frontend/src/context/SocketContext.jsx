import { createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:4000", {
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
  }, [user]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
