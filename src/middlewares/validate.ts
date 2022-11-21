import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError, ZodRecord } from "zod";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: error.issues });
    }
  };

export default validate;
