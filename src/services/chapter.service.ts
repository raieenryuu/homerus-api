import { Prisma } from "@prisma/client";
import { describe } from "node:test";
import { title } from "process";
import { db } from "../utils/db.server";

export async function verifyChapterOwnership(
  chapterId: string,
  userId: string
): Promise<boolean> {
  const chapter = await db.chapter.findFirst({
    where: {
      id: chapterId,
    },
    select: {
      story: {
        select: {
          authorId: true,
        },
      },
    },
  });

  if (chapter) {
    return chapter.story.authorId === userId;
  }

  return false;
}
export async function createChapter(chapter: Prisma.ChapterCreateInput) {
  return await db.chapter.create({
    data: {
      ...chapter,
    },
  });
}

export async function deleteChapter(chapterId: string) {
  return await db.chapter.delete({
    where: {
      id: chapterId,
    },
  });
}

export async function getChapterById(chapterId: string) {
  return await db.chapter.findFirst({
    where: {
      id: chapterId,
    },
  });
}

export async function getAllChapters() {
  return await db.chapter.findMany();
}

export async function updateChapter(chapter: {
  id: string;
  title: string;
  description: string;
  content: string;
}) {
  try {
    const { id, title, description, content } = chapter;
    const updatedChapter = await db.chapter.update({
      where: { id },
      data: {
        title: title,
        description: description,
        content: content,
      },
    });

    if (!updatedChapter) {
      return null;
    }

    return updatedChapter;
  } catch (error) {
    return null;
  }
}

export async function getChaptersByStoryId(storyId: string) {
  const chapters = db.chapter.findMany({
    where: {
      storyId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      story: {
        select: {
          author: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  return chapters;
}
