import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const getUserInfo = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    req.user.user.password = undefined;
    return res.send(req.user);
  } catch (error) {
    console.log(error);
  }
};

export const updateUserInfo = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.user._id },
      { $set: req.body },
      { new: true }
    );
    return res.json(user);
  } catch (error) {
    return res.status(400).json({
      error: "You are not authorized to update this user",
    });
  }
};

export const userById = async (
  req: any,
  res: Response,
  next: NextFunction,
  id: number
) => {
  try {
    let user = await User.findById(id);
    if (!user) {
      res.status(400).json({
        error: "User not found",
      });
    } else {
      req.user = user as unknown as { [key: string]: string };
      next();
    }
  } catch (error) {
    return res.status(400).json({
      error: "User not found",
    });
  }
};
