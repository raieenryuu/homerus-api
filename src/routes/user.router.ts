import { Request, Response, Router } from "express";
import * as authorService from "../services/author.service";
import { auth } from "../middlewares/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  buildTokens,
  clearTokens,
  Cookies,
  refreshTokens,
  setTokens,
  verifyRefreshToken,
} from "../utils/auth-utils";

const userRouter = Router();

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authorService.findAuthorByEmail(email);

    if (!user) {
      throw new Error("wrong credentials");
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (isMatch) {
      const { accessToken, refreshToken } = buildTokens(user);
      setTokens(res, accessToken, refreshToken);

      return res.status(200).json({ message: "signed in successfully" });
    } else {
      throw new Error("wrong credentials");
    }
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
});

userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const saltRounds = 12;

    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await authorService.createAuthor({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json("User registered successfully");
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

userRouter.post("/refresh", async (req: Request, res: Response) => {
  try {
    const current = verifyRefreshToken(req.cookies.refresh);
    const user = await authorService.getAuthorById(current.userId);

    if (!user) throw "User not found";

    const { accessToken, refreshToken } = refreshTokens(
      current,
      user.tokenVersion
    );

    setTokens(res, accessToken, refreshToken);
    return res.status(200).json({ message: "Tokens successfully refreshed" });
  } catch (error) {
    clearTokens(res);
  }
});

userRouter.post("/logout", auth, (req: Request, res: Response) => {
  clearTokens(res);
  res.end();
});

userRouter.post("/logout-all", auth, async (req: Request, res: Response) => {
  await authorService.increaseTokenVersion(res.locals.token.userId);

  clearTokens(res);
  res.end();
});

userRouter.get("/me", auth, async (req: Request, res: Response) => {
  const user = await authorService.getAuthorById(res.locals?.token.userId);

  res.status(200).json(user);
});

export default userRouter;
