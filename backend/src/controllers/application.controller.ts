
import type { Request, Response } from "express";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} from "../services/application.service";

export const createApplicationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const application = await createApplication(req.body);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to submit application",
    });
  }
};

export const getAllApplicationsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, jobId, search } = req.query;

    const applications = await getAllApplications({
      status: status as string,
      jobId: jobId as string,
      search: search as string,
    });

    res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      total: applications.length,
      applications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch applications",
    });
  }
};

export const getApplicationByIdController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
      return;
    }

    const application = await getApplicationById(id);

    res.status(200).json({
      success: true,
      message: "Application fetched successfully",
      application,
    });
  } catch (error: unknown) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Application not found",
    });
  }
};

export const updateApplicationStatusController = async (
  req: Request<{ id: string }, unknown, { status?: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
      return;
    }

    if (!status) {
      res.status(400).json({
        success: false,
        message: "Application status is required",
      });
      return;
    }

    const application = await updateApplicationStatus(id, status);

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update application status",
    });
  }
};
