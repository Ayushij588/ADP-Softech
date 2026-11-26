import Client from "../models/Client";
import { Types } from "mongoose";

// Create Client
export const createClient = async (data: any) => {
  const existingClient = await Client.findOne({
    contactEmail: data.contactEmail,
  });

  if (existingClient) {
    throw new Error("Client with this email already exists");
  }

  const client = await Client.create(data);
  return client;
};

// Get All Clients
export const getAllClients = async () => {
  const clients = await Client.find().sort({ createdAt: -1 });
  return clients;
};

// Get Client By ID
export const getClientById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid client ID");
  }

  const client = await Client.findById(id);

  if (!client) {
    throw new Error("Client not found");
  }

  return client;
};

// Update Client
export const updateClient = async (id: string, data: any) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid client ID");
  }

  const client = await Client.findById(id);

  if (!client) {
    throw new Error("Client not found");
  }

  if (data.contactEmail && data.contactEmail !== client.contactEmail) {
    const existingClient = await Client.findOne({
      contactEmail: data.contactEmail,
    });

    if (existingClient) {
      throw new Error("Email already belongs to another client");
    }
  }

  Object.assign(client, data);
  await client.save();

  return client;
};

// Update Client Status
export const updateClientStatus = async (
  id: string,
  status: "active" | "inactive"
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid client ID");
  }

  const client = await Client.findById(id);

  if (!client) {
    throw new Error("Client not found");
  }

  client.status = status;
  await client.save();

  return client;
};

// Delete Client
export const deleteClient = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid client ID");
  }

  const client = await Client.findById(id);

  if (!client) {
    throw new Error("Client not found");
  }

  await Client.findByIdAndDelete(id);

  return client;
};