import React, { useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

const Message = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-[calc(100vh-150px)] border rounded-lg">
      <ConversationList selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
      <ChatWindow selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
    </div>
  );
};

export default Message;
