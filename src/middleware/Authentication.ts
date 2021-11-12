import { verifyToken } from "../utils/auth";
import { NextFunction, Request, Response } from "express";

const verifyAuthHeader = (req: Request) => {
  const token = req.headers.auth_token;
  const payload = verifyToken(token as string);
  if (!token) return { error: "authentication error" };
  if (!payload) return { error: "token error" };
  return payload;
};

export const verifyUser = (req: any, res: Response, next: NextFunction) => {
  const payload: any = verifyAuthHeader(req);
  let error;
  let statusCode;

  if (payload && payload.error === "authentication error") {
    statusCode = 401;
    error = "No authorization header was specified";
    res.status(statusCode).json({
      statusCode,
      error,
    });
    return;
  }
  if (payload && payload.error === "token error") {
    statusCode = 401;
    error = "Token provided cannot be authenticated";
    res.status(statusCode).json({
      statusCode,
      error,
    });
    return;
  }
  req.user = payload;
  next();
};

export const verifyAdmin = (req: any, res: Response, next: NextFunction) => {
  const payload: any = verifyAuthHeader(req);
  let error;
  let statusCode;

  if (payload && payload.error === "authentication error") {
    statusCode = 401;
    error = "No authorization header was specified";
    res.status(statusCode).json({
      statusCode,
      error,
    });
    return;
  }
  if (payload && payload.error === "token error") {
    statusCode = 401;
    error = "Token provided cannot be authenticated";
    res.status(statusCode).json({
      statusCode,
      error,
    });
    return;
  }

  if (payload.user.role === 0) {
    statusCode = 403;
    error = "Unauthorized access";
    res.status(statusCode).json({
      statusCode,
      error,
    });
    return;
  }

  req.user = payload;
  next();
};
