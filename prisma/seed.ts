import { prisma } from "@prisma/client";
import { db } from "../src/utils/db.server";

type Author = {
  username: string;
  password: string;
  email: string;
};

type Story = {
  title: string;
  description: string;
};

type Chapter = {
  title: string;
  content: string;
  description: string;
};

async function clearDB(): Promise<void> {
  await db.author.deleteMany({});
  await db.story.deleteMany({});
  await db.chapter.deleteMany({});
}

async function seed(): Promise<void> {
  clearDB();
  Promise.all(
    getAuthors().map((author) => {
      return db.author.create({
        data: {
          email: author.email,
          password: author.password,
          username: author.username,
        },
      });
    })
  );

  let author = await db.author.findFirst({
    where: { username: "George R.R Martin" },
  });

  Promise.all(
    getStories().map((story) => {
      return db.story.create({
        data: {
          title: story.title,
          description: story.description,
          authorId: author!.id,
        },
      });
    })
  );

  let story = await db.story.findFirst({
    where: { title: "A song of Ice And Fire" },
  });

  Promise.all(
    getChapters().map((chapter) => {
      return db.chapter.create({
        data: {
          title: chapter.title,
          description: chapter.description,
          content: chapter.content,
          storyId: story!.id,
        },
      });
    })
  );
}

seed();

function getAuthors(): Array<Author> {
  return [
    {
      username: "George R.R Martin",
      password: "12345678",
      email: "georgerrmartin@gmail.com",
    },
    {
      username: "Robin Hobb",
      password: "12345678",
      email: "robinhobb@gmail.com",
    },
    {
      username: "Brandon Sanderson",
      password: "12345678",
      email: "brandonsanderson@gmail.com",
    },
  ];
}

function getStories(): Array<Story> {
  return [
    {
      title: "A song of Ice And Fire",
      description: "Fantasy with politics",
    },
    {
      title: "Fire and Blood",
      description: "Fictional history book about the targaryen dinasty",
    },
    {
      title: "Fevre Dream",
      description: "Vampires and steam boats",
    },
  ];
}

function getChapters(): Array<Chapter> {
  return [
    {
      title: "Dany",
      description: "Daenerys chapter",
      content: "Daenerys goes to save Westeros from the white walkers",
    },
    {
      title: "The conquering of Westeros",
      description: "Aegon, Rhaenys and Visenya conquer Westeros",
      content: "War, dragons and Cool Stuff",
    },
    {
      title: "Jon",
      description: "Jon is ressurected",
      content:
        "Jon is resurrected and the situation in the wall gets even more confusing",
    },
  ];
}
