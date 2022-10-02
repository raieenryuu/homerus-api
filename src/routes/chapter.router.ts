import { Request, Response, Router } from "express";
import { auth } from "../middlewares/auth";
import * as chapterService from "../services/chapter.service";
import { JwtPayload } from "jsonwebtoken";
import { verifyStoryOwnership } from "../services/story.service";
const chapterRouter = Router();

chapterRouter.post("/", auth, async (req: Request, res: Response) => {
  try {
    let isOwner = await verifyStoryOwnership(
      req.body.storyId as string,
      res.locals.token.userId
    );

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: "This story doesn't belong to you" });
    }

    const chapter = await chapterService.createChapter(req.body);

    return res.status(201).json(chapter);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something wrong ocurred in the server" });
  }
});

chapterRouter.delete("/:id", auth, async (req: Request, res: Response) => {
  try {
    const chapterId = req.params.id;

    const isOwner = await chapterService.verifyChapterOwnership(
      chapterId,
      res.locals.token.userId
    );

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: "You can't delete a chapter you don't own" });
    }
    await chapterService.deleteChapter(chapterId);

    return res.status(201).json({ message: "chapter deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something wrong ocurred in the server" });
  }
});

chapterRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const chapterId = req.params.id;
    const chapter = await chapterService.getChapterById(chapterId);

    if (!chapter) {
      return res
        .status(404)
        .json({ message: "This chapter could not be found" });
    }
    return res.status(200).json(chapter);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something wrong ocurred in the server" });
  }
});

chapterRouter.get("/", async (req: Request, res: Response) => {
  try {
    const chapters = await chapterService.getAllChapters();
    return res.status(200).json(chapters);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something wrong ocurred in the server" });
  }
});

chapterRouter.put("/:id", auth, async (req: Request, res: Response) => {
  try {
    const isOwner = await chapterService.verifyChapterOwnership(
      req.params.id,
      res.locals.token.userId
    );

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: "You can't edit a chapter you don't own" });
    }
    const updatedChapter = await chapterService.updateChapter({
      ...req.body,
      id: req.params.id,
    });

    if (!updatedChapter) {
      return res.status(404).json({ message: "Chapter could not be found" });
    }
    return res.status(200).json(updatedChapter);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Something wrong ocurred in the server" });
  }
});

// get chapters from a story
chapterRouter.get("/", async (req: Request, res: Response) => {
  try {
    const chapters = await chapterService.getAllChapters();
    return res.status(200).json(chapters);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something wrong ocurred in the server" });
  }
});

chapterRouter.get("/story/:id", auth, async (req: Request, res: Response) => {
  try {
    const storyId = req.params.id;
    const chapters = await chapterService.getChaptersByStoryId(storyId);

    return res.status(200).json(chapters);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Something wrong ocurred in the server" });
  }
});

export default chapterRouter;
