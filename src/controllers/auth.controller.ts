import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/auth";
import { Validate } from "../validator";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validate = await Validate.validateAsync(req.body);

    let userExist = await User.findOne({ email: validate.email });
    if (userExist)
      return res.status(409).send({
        status: 409,
        message: "Email is taken",
      });

    const user = new User({
      name: validate.name,
      email: validate.email,
      password: validate.password,
    });

    const result = await user.save();
    res.json(result);
  } catch (error: any) {
    if (error.isJoi) {
      return res.status(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }
    next(error);
    // const err = errorHandler(error);
    // res.send(err);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validate = await Validate.validateAsync(req.body);
    let user = await User.findOne({ email: validate.email });
    if (!user)
      return res.status(400).send({
        status: 400,
        message: "Email does not exist. Please, sign up",
      });

    if (!(await user.comparePassword(validate.password)))
      return res.status(400).send({
        status: 400,
        error: "invalid credentials",
      });

    const token = generateToken({ user });
    return res.status(200).send({
      status: 200,
      message: "login success",
      token,
      data: user,
    });
  } catch (error: any) {
    if (error.isJoi)
      return res.status(400).send({
        status: 400,
        message: error.details[0].message,
      });
    next(error);
  }
};

export const signOut = async (req: Request, res: Response) => {
  res.removeHeader("auth_token");
  res.removeHeader("Transfer-Encoding");
  res.removeHeader("X-Powered-By");
  return res.status(200).send({
    message: "Signout successful",
  });
};
