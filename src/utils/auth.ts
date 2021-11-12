import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const generateToken = (payload: string | object | Buffer) => {
  const token = jwt.sign(payload, secretKey!);
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const payload = jwt.verify(token, secretKey!);
    return payload;
  } catch (error) {
    return false;
  }
};
