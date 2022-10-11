import { z } from "zod";

export const loginBodySchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Invalid Email" })
      .trim()
      .min(8, { message: "Your email should have at least 8 characters" })
      .max(64, { message: "You email shoud have only up to 64 characters" }),

    password: z
      .string({
        required_error: "Password is required",
      })
      .trim()
      .min(8, { message: "Your password should have at least 8 characters" })
      .max(64, { message: "You password shoud have only up to 64 characters" }),
  }),
});

export const registerBodySchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Invalid Email" })
      .trim()
      .min(8, { message: "Your email should have at least 8 characters" })
      .max(64, { message: "You email shoud have only up to 64 characters" }),

    password: z
      .string({
        required_error: "Password is required",
      })
      .trim()
      .min(8, { message: "Your password should have at least 8 characters" })
      .max(64, { message: "You password shoud have only up to 64 characters" }),

    username: z
      .string({ required_error: "A username is required" })
      .trim()
      .min(4, { message: "Your username needs to have at least 4 characters" })
      .max(30, {
        message: "Your user name should have only up to 30 characters",
      }),
  }),
});

export const storySchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Your story must have a title" })
      .trim()
      .min(4, {
        message: "The title of your story must have at least 4 characters",
      })
      .max(64, {
        message: "The title of your story can have only up to 64 characters",
      }),
    description: z
      .string({ required_error: "Your story must have a description" })
      .trim()
      .min(64, {
        message: "Your description must have at least 64 characters",
      })
      .max(512, {
        message:
          "The description of your story can have only up to 512 characters",
      }),
  }),
});

export const chapterSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Your chapter must have a title" })
      .trim()
      .min(4, {
        message: "The title of your chapter must have at least 4 characters",
      })
      .max(64, {
        message: "The title of your chapter can have only up to 64 characters",
      }),
    description: z
      .string({ required_error: "Your chapter must have a description" })
      .trim()
      .min(64, {
        message:
          "The description of your chapter must have at least 32 characters",
      })
      .max(256, {
        message:
          "The description of your chapter can have only up to 256 characters",
      }),
    content: z
      .string({ required_error: "Your chapter should have content" })
      .trim(),

    // wordCount: z
    //   .number({
    //     required_error: "Your chapter must have a word count",
    //   })
    //   .min(512, { message: "Your chapter must have at least 512 words" })
    //   .max(10000, { message: "Your chapter can only have up to 10000 words" }),
  }),
});
