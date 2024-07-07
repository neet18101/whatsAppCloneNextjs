
import getPrismaInstance from "../utils/PrismaClient.js";

export const checkedUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ msg: "Email not found", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });
    // const user = await User.findOne({ email });
 
    console.log(user);
    if (!user) {
      return res.json({ msg: "User No Found", status: false });
    } else {
      user.id = user.id.toString("hex");
      return res.json({ msg: "User Found", status: true, data: user });
    }
  } catch (error) {
    console.log(error);
  }
};
export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, about, image: profilePicture } = req.body;
    if (!email || !name || !profilePicture) {
      return res.send(
        "Email, Name, Profile Picture, and Username are required."
      );
    }

    const prisma = getPrismaInstance();

    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Create the new user
    const user = await prisma.user.create({
      data: { email, name, about, profilePicture },
    });

    return res.json({ msg: "success", status: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        about: true,
      },
    });
    users.forEach((user) => {
      user.id = user.id.toString("hex");
    });
    // group the user name by letter
    const usersGroupByInitialLetter = {};
    users.forEach((user) => {
      const firstLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupByInitialLetter[firstLetter]) {
        usersGroupByInitialLetter[firstLetter] = [user];
      } else {
        usersGroupByInitialLetter[firstLetter].push(user);
      }
    });
    return res
      .status(200)
      .send({ msg: "success", status: true, users: usersGroupByInitialLetter });
  } catch (error) {
    next(error);
  }
};
