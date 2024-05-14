const mongoose = require("mongoose");

const { Schema } = mongoose;

// Define User schema
const userSchema = new Schema({
  email: { type: String, unique: true },
  name: String,
  profilePicture: { type: String, default: "" },
  about: { type: String, default: "" },
  sentMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  receivedMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
});

// Define Message schema
const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, default: "text" },
  message: String,
  messageStatus: { type: String, default: "sent" },
  createdAt: { type: Date, default: Date.now },
});

// Create models
const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { User, Message };
