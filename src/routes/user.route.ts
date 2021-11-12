import express, { Request, Response } from "express";
import {
  userById,
  getUserInfo,
  updateUserInfo,
} from "../controllers/user.controller";
import { verifyUser, verifyAdmin } from "../middleware/Authentication";

const userRouter = express.Router();

userRouter.get("/user/:userId", verifyAdmin, (req: any, res: Response) => {
  res.json(req.user);
});

userRouter.get("/userinfo/:userId", verifyUser, getUserInfo);
userRouter.put("/userinfo/:userId", verifyUser, updateUserInfo);

userRouter.param("userId", userById);

export default userRouter;
