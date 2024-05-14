import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRouter from "./routes/MessageRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // Note the parentheses here
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/messages", MessageRouter);

const PORT = process.env.PORT || 3000; // Use a default port if PORT is not defined
const server = app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});

global.onlineUsers = new Map();
