import { Prisma } from "@prisma/client";
import { db } from "../utils/db.server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Author } from "../types/interfaces";

export async function getAuthors(): Promise<Author[]> {
  const authors = await db.author.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return authors;
}

export async function createAuthor(author: Prisma.AuthorCreateInput) {
  const { email, username, password } = author;
  return db.author.create({
    data: {
      email,
      username,
      password,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });
}

export async function getAuthorById(id: string) {
  return db.author.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      tokenVersion: true,
    },
  });
}

export async function findAuthorByEmail(email: string) {
  const findAuthor = await db.author.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      password: true,
      tokenVersion: true,
    },
  });

  return findAuthor;
}

export async function increaseTokenVersion(userId: string) {
  await db.author.update({
    where: {
      id: userId,
    },
    data: {
      tokenVersion: { increment: 1 },
    },
  });
}
