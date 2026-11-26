import { Request, Response } from "express";
import * as clientService from "../services/client.service";

// Create Client
export const createClientController = async (req: Request, res: Response) => {
  try {
    const client = await clientService.createClient(req.body);

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Clients
export const getAllClientsController = async (
  req: Request,
  res: Response
) => {
  try {
    const clients = await clientService.getAllClients();

    return res.status(200).json({
      success: true,
      total: clients.length,
      clients,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Client By ID
export const getClientByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const client = await clientService.getClientById(String(req.params.id));

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Client
export const updateClientController = async (
  req: Request,
  res: Response
) => {
  try {
    const client = await clientService.updateClient(
      String(req.params.id),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Client Status
export const updateClientStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const client = await clientService.updateClientStatus(
      String(req.params.id),
      req.body.status
    );

    return res.status(200).json({
      success: true,
      message: "Client status updated successfully",
      client,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Client
export const deleteClientController = async (
  req: Request,
  res: Response
) => {
  try {
    const client = await clientService.deleteClient(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      client,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};