import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const details = isRecord(error) ? error : {};
  const isProduction = env.NODE_ENV === "production";

  if (
    details.type === "entity.parse.failed" ||
    (error instanceof SyntaxError &&
      "body" in details &&
      details.status === 400)
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
    return;
  }

  if (details.code === 11000) {
    res.status(409).json({
      success: false,
      message: "A record with this value already exists",
    });
    return;
  }

  if (details.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: isProduction
        ? "Validation failed"
        : typeof details.message === "string"
          ? details.message
          : "Validation failed",
    });
    return;
  }

  if (details.name === "CastError" && details.kind === "ObjectId") {
    res.status(400).json({
      success: false,
      message: isProduction
        ? "Invalid ID"
        : typeof details.message === "string"
          ? details.message
          : "Invalid ID",
    });
    return;
  }

  const requestedStatusCode = details.statusCode ?? details.status;
  const statusCode =
    typeof requestedStatusCode === "number" &&
    Number.isInteger(requestedStatusCode) &&
    requestedStatusCode >= 400 &&
    requestedStatusCode <= 599
      ? requestedStatusCode
      : 500;
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof details.message === "string"
        ? details.message
        : undefined;
  const message =
    statusCode >= 500 && isProduction
      ? "Internal server error"
      : errorMessage ??
        (statusCode === 500 ? "Internal server error" : "Request failed");

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
