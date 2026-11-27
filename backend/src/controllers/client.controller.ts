import mongoose from "mongoose";
import type { NextFunction, Request, Response } from "express";
import * as clientService from "../services/client.service";
import {
  createClientSchema,
  updateClientSchema,
  updateClientStatusSchema,
} from "../validators/client.validator";

const notFoundMessages = new Set(["Client not found"]);
const duplicateMessages = new Set([
  "Client with this email already exists",
  "Email already belongs to another client",
]);
const invalidInputMessages = new Set([
  "Client data is required",
  "Company name is required",
  "Contact person is required",
  "Contact email is required",
  "Company name must be a string",
  "Industry must be a string",
  "Website must be a string",
  "Contact person must be a string",
  "Contact email must be a string",
  "Contact phone must be a string",
  "Address must be a string",
  "Invalid contact email",
  "Invalid client ID",
]);

const forwardClientError = (next: NextFunction, error: unknown): void => {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error.name === "CastError" || error.name === "ValidationError")
  ) {
    next(error);
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    next(error);
    return;
  }

  const statusCode =
    error instanceof Error && notFoundMessages.has(error.message)
      ? 404
      : error instanceof Error && duplicateMessages.has(error.message)
        ? 409
        : error instanceof Error && invalidInputMessages.has(error.message)
          ? 400
          : undefined;

  if (statusCode !== undefined && error instanceof Error) {
    next(Object.assign(new Error(error.message), { statusCode }));
    return;
  }

  next(error);
};

const validateClientId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid client ID",
    });
    return false;
  }

  return true;
};

// Create Client
export const createClientController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = createClientSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.issues[0]?.message ?? "Invalid client data",
      });
    }

    if (
      !validation.data.companyName.trim() ||
      !validation.data.contactPerson.trim() ||
      !validation.data.contactEmail.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Company name, contact person, and contact email are required",
      });
    }

    const client = await clientService.createClient(validation.data);

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error: unknown) {
    forwardClientError(next, error);
  }
};

// Get All Clients
export const getAllClientsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clients = await clientService.getAllClients();

    return res.status(200).json({
      success: true,
      total: clients.length,
      clients,
    });
  } catch (error: unknown) {
    forwardClientError(next, error);
  }
};

// Get Client By ID
export const getClientByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    if (!validateClientId(id, res)) {
      return;
    }

    const client = await clientService.getClientById(id);

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error: unknown) {
    forwardClientError(next, error);
  }
};

// Update Client
export const updateClientController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    if (!validateClientId(id, res)) {
      return;
    }

    const validation = updateClientSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.issues[0]?.message ?? "Invalid client data",
      });
    }

    if (
      (validation.data.companyName !== undefined &&
        !validation.data.companyName.trim()) ||
      (validation.data.contactPerson !== undefined &&
        !validation.data.contactPerson.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Company name and contact person cannot be empty",
      });
    }

    const client = await clientService.updateClient(
      id,
      validation.data
    );

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error: unknown) {
    forwardClientError(next, error);
  }
};

// Update Client Status
export const updateClientStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    if (!validateClientId(id, res)) {
      return;
    }

    const validation = updateClientStatusSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.issues[0]?.message ?? "Invalid client status",
      });
    }

    const client = await clientService.updateClientStatus(
      id,
      validation.data.status
    );

    return res.status(200).json({
      success: true,
      message: "Client status updated successfully",
      client,
    });
  } catch (error: unknown) {
    forwardClientError(next, error);
  }
};

// Delete Client
export const deleteClientController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    if (!validateClientId(id, res)) {
      return;
    }

    const client = await clientService.deleteClient(id);

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      client,
    });
  } catch (error: unknown) {
    forwardClientError(next, error);
  }
};