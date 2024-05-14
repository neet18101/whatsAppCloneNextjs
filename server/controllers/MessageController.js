import getPrismaIntance from "../utils/PrismaClient.js";
export const addMessage = async (req, res, next) => {
  // here creating a function for adding message
  try {
    const prisma = getPrismaIntance();
    const { message, from, to } = req.body;
    console.log(prisma,message,from,to);
    const getUser = onlineUsers.get(to);
    if (message && from && to) {
      const newMessage = await prisma.Messages.create({
        // Here
        data: {
          message,
          sender: { connect: { id: parseInt(from) } },
          reciever: { connect: { id: parseInt(to) } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, reciever: true },
      });
      return res
        .status(200)
        .send({ msg: "success", status: true, data: newMessage });
    }
    return res.status(400).send({ msg: "error", status: false });
  } catch (error) {
    console.log(error);
  }
};
