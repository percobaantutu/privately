import React, { useContext, useEffect, useState } from "react";
import { MessagesSquare } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const MessageBell = () => {
  const { user, backendUrl } = useContext(AppContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // THE FIX IS HERE: We now check for user AND user._id
    if (!user || !user._id) return;

    const fetchUnreadCount = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/messages/conversations`);
        if (data.success) {
          const count = data.conversations.filter((conv) => conv.lastMessage.sender !== user._id && !conv.lastMessage.seenBy.includes(user._id)).length;
          setUnreadCount(count);
        }
      } catch (error) {
        console.error("Failed to fetch unread message count");
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 30000); // Poll for new messages every 30 seconds

    return () => clearInterval(intervalId);
  }, [user, backendUrl]);

  return (
    <button onClick={() => navigate("/messages")} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
      <MessagesSquare size={22} className="text-gray-600" />
      {unreadCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{unreadCount}</span>}
    </button>
  );
};

export default MessageBell;
