// frontend/src/pages/Messages/ConversationList.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "../../utils/axios";
import { AppContext } from "@/context/AppContext";
import { useSocketContext } from "@/context/SocketContext";

const ConversationList = ({ selectedConversation, setSelectedConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useContext(AppContext);
  const { onlineUsers } = useSocketContext();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/messages/conversations`);
        if (data.success) {
          setConversations(data.conversations);
        }
      } catch (error) {
        console.error("Error fetching conversations", error);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);

  return (
    <div className="w-1/3 border-r">
      <div className="p-4 font-bold border-b">Chats</div>
      <div className="overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Loading conversations...</p>
        ) : (
          // THIS IS THE FIX: We filter out any conversation that doesn't have a valid second participant.
          conversations
            .filter((conv) => conv.participants && conv.participants.length > 0)
            .map((conv) => {
              const otherUser = conv.participants[0];
              const isOnline = onlineUsers.includes(otherUser._id);
              return (
                <div key={conv._id} onClick={() => setSelectedConversation(conv)} className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-100 ${selectedConversation?._id === conv._id ? "bg-blue-50" : ""}`}>
                  <div className="relative">
                    <img src={otherUser.profilePicture} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                    {isOnline && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>}
                  </div>
                  <div>
                    <p className="font-semibold">{otherUser.fullName}</p>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage.text}</p>
                  </div>
                </div>
              );
            })
        )}
        {!loading && conversations.length === 0 && <p className="p-4 text-center text-sm text-gray-500">No conversations yet.</p>}
      </div>
    </div>
  );
};

export default ConversationList;
