import { Request, Response, Router } from "express";
import { auth } from "../middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import * as storyService from "../services/story.service";
import { verifyStoryOwnership } from "../services/story.service";
import validate from "../middlewares/validate";
import { storySchema } from "../validation/zod-schemas";

const storyRouter = Router();
// Get all stories

storyRouter.get("/", async (req: Request, res: Response) => {
  try {
    const stories = await storyService.getAllStories();
    return await res.status(200).json(stories);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Create a story
storyRouter.post(
  "/",
  auth,
  validate(storySchema),
  async (req: Request, res: Response) => {
    try {
      const story = {
        ...req.body,
        authorId: res.locals.token.userId,
      };
      const createdStory = await storyService.createStory(story);

      return res.status(201).json(createdStory);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// Delete a story

storyRouter.delete("/:id", auth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const isOwner = verifyStoryOwnership(id, res.locals.token.userId);

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: "You can't delete a story that isn't yours" });
    }

    await storyService.deleteStoryById(id);

    return res
      .status(200)
      .json({ message: "The story has been successfully deleted" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all stories form a user

storyRouter.get("/author/:id", async (req: Request, res: Response) => {
  try {
    const authorId = req.params.id;

    const stories = await storyService.getAuthorStories(authorId);

    return res.status(200).json(stories);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

storyRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const storyId = req.params.id;

    const story = await storyService.getStoryById(storyId);

    if (!story) {
      return res.status(404).json({ message: "This story could not be found" });
    }

    return res.status(200).json(story);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

storyRouter.put(
  "/:id",
  auth,
  validate(storySchema),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const isOwner = verifyStoryOwnership(id, res.locals.token.userId);

      if (!isOwner) {
        return res
          .status(401)
          .json({ message: "You can't edit a story that isn't yours" });
      }
      const updatedStory = await storyService.updateStory({
        ...req.body,
        id,
      });

      if (!updatedStory) {
        return res.status(404).json({ message: "Story could not be found" });
      }
      return res.status(200).json(updatedStory);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Something wrong ocurred in the server" });
    }
  }
);

export default storyRouter;
