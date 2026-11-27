import mongoose from "mongoose";
import type { Request, Response } from "express";
import {
  createApplicationNote,
  getApplicationNotes,
} from "../services/applicationNote.service";
import type { AuthRequest } from "../middleware/auth.middleware";

export const createApplicationNoteController = async (
  req: AuthRequest &
    Request<unknown, unknown, { applicationId?: string; note?: string }>,
  res: Response
): Promise<void> => {
  try {
    const { applicationId, note } = req.body;
    const access = req.user;

    if (!access) {
      res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
      return;
    }

    if (!applicationId || typeof note !== "string") {
      res.status(400).json({
        success: false,
        message: "Application ID and note are required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
      return;
    }

    if (!note.trim()) {
      res.status(400).json({
        success: false,
        message: "Note content is required",
      });
      return;
    }

    const applicationNote = await createApplicationNote(
      applicationId,
      access.userId,
      note,
      access
    );

    res.status(201).json({
      success: true,
      message: "Application note added successfully",
      applicationNote,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to add application note";
    const statusCode =
      message === "Invalid application ID"
        ? 400
        : message === "Application not found"
          ? 404
          : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getApplicationNotesController = async (
  req: AuthRequest & Request<{ applicationId: string }>,
  res: Response
): Promise<void> => {
  try {
    const access = req.user;
    if (!access) {
      res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
      return;
    }

    const { applicationId } = req.params;

    if (!applicationId) {
      res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
      return;
    }

    const notes = await getApplicationNotes(applicationId, access);

    res.status(200).json({
      success: true,
      message: "Application notes fetched successfully",
      total: notes.length,
      notes,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch application notes";
    const statusCode =
      message === "Invalid application ID"
        ? 400
        : message === "Application not found"
          ? 404
          : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};