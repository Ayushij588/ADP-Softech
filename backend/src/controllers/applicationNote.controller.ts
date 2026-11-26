import type { Request, Response } from "express";
import {
  createApplicationNote,
  getApplicationNotes,
} from "../services/applicationNote.service";

export const createApplicationNoteController = async (
  req: Request<
    unknown,
    unknown,
    { applicationId?: string; recruiterId?: string; note?: string }
  >,
  res: Response
): Promise<void> => {
  try {
    const { applicationId, recruiterId, note } = req.body;

    if (!applicationId || !recruiterId || !note) {
      res.status(400).json({
        success: false,
        message: "Application ID, recruiter ID, and note are required",
      });
      return;
    }

    const applicationNote = await createApplicationNote(
      applicationId,
      recruiterId,
      note
    );

    res.status(201).json({
      success: true,
      message: "Application note added successfully",
      applicationNote,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to add application note",
    });
  }
};

export const getApplicationNotesController = async (
  req: Request<{ applicationId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
      return;
    }

    const notes = await getApplicationNotes(applicationId);

    res.status(200).json({
      success: true,
      message: "Application notes fetched successfully",
      total: notes.length,
      notes,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch application notes",
    });
  }
};