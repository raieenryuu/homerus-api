import { Prisma } from "@prisma/client";
import { db } from "../utils/db.server";

export async function verifyStoryOwnership(
  storyId: string,
  userId: string
): Promise<boolean> {
  const story = await db.story.findFirst({
    where: {
      id: storyId,
    },
  });

  if (story) {
    return story.authorId === userId;
  }

  return false;
}

export async function createStory(story: Prisma.StoryCreateInput) {
  const newStory = await db.story.create({
    data: {
      ...story,
    },
  });

  return newStory;
}

export async function deleteStoryById(id: string) {
  return await db.story.delete({
    where: {
      id,
    },
  });
}

export async function getAllStories() {
  return await db.story.findMany({
    where: {},
    select: {
      author: {
        select: {
          email: true,
          username: true,
          createdAt: true,
        },
      },
      description: true,
      chapters: true,
      id: true,
      isPublished: true,
      title: true,
      authorId: true,
    },
  });
}

// gets all stories from a specific user

export async function getAuthorStories(authorId: string) {
  return await db.story.findMany({
    where: {
      authorId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      isPublished: true,
    },
  });
}

export async function getStoryById(id: string) {
  return await db.story.findUnique({
    where: {
      id,
    },
  });
}

export async function updateStory(story: {
  id: string;
  title: string;
  description: string;
  isPublished?: boolean;
}) {
  const { id, title, description, isPublished } = story;

  try {
    const updatedStory = await db.story.update({
      where: { id },
      data: {
        title: title,
        description: description,
        isPublished: isPublished,
      },
    });

    return updatedStory;
  } catch (error: any) {
    return null;
  }
}
