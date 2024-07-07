import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRouter from "./routes/MessageRoutes.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // Note the parentheses here
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/audios", express.static("uploads/audios"));
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/messages", MessageRouter);

const PORT = process.env.PORT || 3000; // Use a default port if PORT is not defined
const server = app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User added: ${userId} with socket ID: ${socket.id}`);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(data);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
        type: data.type,
      });
    }
  });
});
