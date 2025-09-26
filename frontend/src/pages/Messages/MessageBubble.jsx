import React, { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const MessageBubble = ({ message }) => {
  const { user } = useContext(AppContext);

  // Add a guard to prevent crash if user is not loaded yet
  if (!user) {
    return null; // Render nothing until the user object is available
  }

  const fromMe = message.senderId === user._id;

  return (
    <div className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${fromMe ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}>
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
