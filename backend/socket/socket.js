import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/email.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // THIS IS THE GUEST LIST THAT NEEDS TO BE UPDATED
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://www.privately.my.id", // <-- ADD YOUR LIVE FRONTEND DOMAIN
      "https://admin.privately.my.id", // <-- ADD YOUR LIVE ADMIN DOMAIN
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {}; // { userId: socketId }

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("get_online_users", Object.keys(userSocketMap));
  }

  socket.on("send_message", async ({ conversationId, senderId, recipientId, content }) => {
    try {
      const newMessage = new Message({
        conversationId,
        senderId,
        content,
      });

      const [sender, recipient] = await Promise.all([User.findById(senderId), User.findById(recipientId)]);

      await Promise.all([
        newMessage.save(),
        Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: {
            text: content,
            sender: senderId,
            seenBy: [senderId],
          },
        }),
      ]);

      const recipientSocketId = getRecipientSocketId(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_message", newMessage);
      } else {
        if (recipient && sender) {
          await sendEmail(recipient.email, "new_message", {
            recipientName: recipient.fullName,
            senderName: sender.fullName,
          });
        }
      }

      socket.emit("receive_message", newMessage);
    } catch (error) {
      console.error("Error handling send_message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    io.emit("get_online_users", Object.keys(userSocketMap));
  });
});

export { app as socketApp, server as socketServer, io };
