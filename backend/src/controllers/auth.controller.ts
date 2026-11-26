
import { Request, Response } from "express";
import { loginSchema, createRecruiterSchema } from "../validators/auth.validator";
import { loginUser, createRecruiter } from "../services/auth.service";

// Login controller
export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => issue.message),
      });
      return;
    }

    const result = await loginUser(validation.data);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

// Create Recruiter controller
export const createRecruiterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validation = createRecruiterSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => issue.message),
      });
      return;
    }

    const recruiter = await createRecruiter(validation.data);

    res.status(201).json({
      success: true,
      message: "Recruiter created successfully",
      data: recruiter,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    const statusCode =
      message === "Email is already registered" ? 409 : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
