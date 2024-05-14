import { Router } from "express";
import { checkedUser, getAllUsers, onBoardUser } from "../controllers/AuthController.js";

const router = Router();

router.post('/check-user',checkedUser);
router.post('/onboard-user',onBoardUser);
router.get('/get-contacts',getAllUsers)

export default router