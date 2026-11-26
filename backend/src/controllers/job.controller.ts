
import { Request, Response } from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  updateJobPublication,
  deleteJob,
} from "../services/job.service";

// Create Job
export const createJobController = async (req: Request, res: Response) => {
  try {
    const job = await createJob(req.body);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Jobs
export const getAllJobsController = async (req: Request, res: Response) => {
  try {
    const jobs = await getAllJobs();

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      total: jobs.length,
      jobs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Job By ID
export const getJobByIdController = async (req: Request, res: Response) => {
  try {
    const job = await getJobById(String(req.params.id));

    res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      job,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Job
export const updateJobController = async (req: Request, res: Response) => {
  try {
    const job = await updateJob(String(req.params.id), req.body);

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Job Status
export const updateJobStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const job = await updateJobStatus(
      String(req.params.id),
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Publish / Unpublish Job
export const updateJobPublicationController = async (
  req: Request,
  res: Response
) => {
  try {
    const job = await updateJobPublication(
      String(req.params.id),
      req.body.isPublished
    );

    res.status(200).json({
      success: true,
      message: `Job ${req.body.isPublished ? "published" : "unpublished"} successfully`,
      job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Job
export const deleteJobController = async (req: Request, res: Response) => {
  try {
    const job = await deleteJob(String(req.params.id));

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      job,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
