import { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../utils/auth-utils";

import { Cookies } from "../utils/auth-utils";

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = verifyAccessToken(req.cookies?.access);

  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not allowed to access this resource" });
  }

  res.locals.token = token;

  next();
}
