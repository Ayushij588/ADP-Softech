import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type RequestPart = "body" | "params" | "query";

type ValidationSchemas = Partial<Record<RequestPart, ZodType>>;

export const validateRequest = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];
    const validatedRequest: Partial<Record<RequestPart, unknown>> = {};

    for (const part of ["body", "params", "query"] as const) {
      const schema = schemas[part];
      if (!schema) {
        continue;
      }

      const result = schema.safeParse(req[part]);
      if (result.success) {
        validatedRequest[part] = result.data;
        if (part === "body") {
          req.body = result.data;
        }
      } else {
        errors.push(
          ...result.error.issues.map((issue) => {
            const path = issue.path.join(".");
            return `${part}${path ? `.${path}` : ""}: ${issue.message}`;
          })
        );
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    res.locals.validatedRequest = validatedRequest;
    next();
  };
};
