import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import userRouter from "./routes/user.router";
import storyRouter from "./routes/story.router";
import chapterRouter from "./routes/chapter.router";
import cookieParser from "cookie-parser";
dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app = express();

app.use(cors({ credentials: true, origin: process.env.DEV_CLIENT_URL }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/story", storyRouter);
app.use("/api/chapter", chapterRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});
