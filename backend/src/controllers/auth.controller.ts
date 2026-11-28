
import { Request, Response } from "express";
import { loginUser, createRecruiter } from "../services/auth.service";

// Login controller
export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: unknown) {
    const isAuthenticationError =
      error instanceof Error &&
      (error.message === "Invalid email or password" ||
        error.message === "Your account is inactive or suspended");
    const message = isAuthenticationError
      ? error.message
      : "Something went wrong";

    res.status(isAuthenticationError ? 401 : 500).json({
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
    const recruiter = await createRecruiter(req.body);

    res.status(201).json({
      success: true,
      message: "Recruiter created successfully",
      data: recruiter,
    });
  } catch (error: unknown) {
    const isDuplicateEmail =
      (error instanceof Error &&
        error.message === "Email is already registered") ||
      (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000);
    const statusCode = isDuplicateEmail ? 409 : 500;
    const message = isDuplicateEmail
      ? "Email is already registered"
      : "Failed to create recruiter";

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
