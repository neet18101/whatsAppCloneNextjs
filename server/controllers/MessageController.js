import getPrismaIntance from "../utils/PrismaClient.js";
import { ObjectId } from "mongodb";
import { renameSync } from "fs";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaIntance();
    if (!prisma) {
      throw new Error("Prisma client is undefined");
    }
    const { message, from, to } = req.body;
    const getUser = onlineUsers.get(to);
    if (message && from && to) {
      const senderId = new ObjectId(from);
      const receiverId = new ObjectId(to);
      const newMessage = await prisma.message.create({
        data: {
          message,
          sender: { connect: { id: senderId?.toString() } }, // Assuming 'from' is the sender's id
          receiver: { connect: { id: receiverId?.toString() } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, receiver: true },
      });

      return res
        .status(200)
        .send({ msg: "success", status: true, data: newMessage });
    }

    return res.status(400).send({ msg: "error", status: false });
  } catch (error) {
    console.error("Error adding message:", error);
    return res
      .status(500)
      .send({ msg: "error", status: false, error: error.message });
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaIntance();
    if (!prisma) {
      throw new Error("Prisma client is undefined");
    }

    const { from, to } = req.params;
    const senderId = new ObjectId(from);
    const receiverId = new ObjectId(to);
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId.toString(), receiverId: receiverId.toString() },
          { senderId: receiverId.toString(), receiverId: senderId.toString() },
        ],
      },
      orderBy: { id: "asc" },
      include: { sender: true, receiver: true },
    });
    const unreadMessage = [];

    // from :- 1 lucifer to:-  2 darkevil two user  we check message status will read or not

    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "read" &&
        message.senderId.toString() === receiverId.toString()
      ) {
        messages[index].messageStatus = "read";
        unreadMessage.push(message.id);
      }
    });
    await prisma.message.updateMany({
      where: { id: { in: unreadMessage } },
      data: { messageStatus: "read" },
    });

    return res
      .status(200)
      .send({ msg: "success", status: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const data = Date.now();
      let fileName = "uploads/images/" + data + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaIntance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.message.create({
          data: {
            message: fileName,
            sender: { connect: { id: new ObjectId(from).toString() } }, // Assuming 'from' is the sender's id
            receiver: { connect: { id: new ObjectId(to).toString() } },
            messageStatus: "sent",
            type: "image",
          },
          include: { sender: true, receiver: true },
        });

        return res.status(201).json({ message });
      }

      return res.status(400).send({ msg: "error", status: false });
    }
    res.status(400).send({ msg: "Image is not found", status: false });
  } catch (error) {}
};

// send Audio message
export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/audios/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaIntance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.message.create({
          data: {
            message: fileName,
            sender: { connect: { id: new ObjectId(from).toString() } }, // Assuming 'from' is the sender's id
            receiver: { connect: { id: new ObjectId(to).toString() } },
            messageStatus: "sent",
            type: "audio",
          },
          include: { sender: true, receiver: true },
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to is required.");
    }
    return res.status(400).send("Audio is required.");
  } catch (err) {
    next(err);
  }
};
