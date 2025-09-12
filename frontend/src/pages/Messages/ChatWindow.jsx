import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "../../utils/axios";
import { AppContext } from "@/context/AppContext";
import { useSocketContext } from "@/context/SocketContext";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ selectedConversation, setSelectedConversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { backendUrl, user } = useContext(AppContext);
  const { socket } = useSocketContext();
  const lastMessageRef = useRef();

  useEffect(() => {
    const markAsSeen = async () => {
      if (selectedConversation && selectedConversation.lastMessage.sender !== user._id && !selectedConversation.lastMessage.seenBy.includes(user._id)) {
        try {
          await axios.put(`${backendUrl}/api/messages/${selectedConversation._id}/seen`);
          // Optionally, you can trigger a context state update here to immediately clear the badge
        } catch (error) {
          console.error("Failed to mark conversation as seen", error);
        }
      }
    };
    if (selectedConversation) {
      const getMessages = async () => {
        try {
          const { data } = await axios.get(`${backendUrl}/api/messages/${selectedConversation._id}`);
          if (data.success) {
            setMessages(data.messages);
          }
        } catch (error) {
          console.error("Error fetching messages", error);
        }
      };
      getMessages();
      markAsSeen();
    }
  }, [selectedConversation, backendUrl, user._id]);

  useEffect(() => {
    socket?.on("receive_message", (message) => {
      if (selectedConversation?._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => socket?.off("receive_message");
  }, [socket, selectedConversation]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const otherUser = selectedConversation.participants[0];

    socket.emit("send_message", {
      conversationId: selectedConversation._id,
      senderId: user._id,
      recipientId: otherUser._id,
      content: newMessage,
    });
    setNewMessage("");
  };

  if (!selectedConversation) {
    return <div className="w-2/3 flex items-center justify-center text-gray-500">Select a conversation to start chatting</div>;
  }

  const otherUser = selectedConversation.participants[0];

  return (
    <div className="w-2/3 flex flex-col">
      <div className="p-4 border-b flex items-center gap-4">
        <img src={otherUser.profilePicture} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        <p className="font-semibold">{otherUser.fullName}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div ref={lastMessageRef} key={msg._id}>
            <MessageBubble message={msg} />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="Type a message..." />
        <button type="submit" className="bg-primary text-white p-2 rounded-lg">
          <Send />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
