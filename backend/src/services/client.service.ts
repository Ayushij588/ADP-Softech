import Client from "../models/Client";
import { Types } from "mongoose";

const normalizeClientData = (data: any, partial = false) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Client data is required");
  }

  const normalizedData = { ...data };
  const stringFields = [
    ["companyName", "Company name"],
    ["industry", "Industry"],
    ["website", "Website"],
    ["contactPerson", "Contact person"],
    ["contactEmail", "Contact email"],
    ["contactPhone", "Contact phone"],
    ["address", "Address"],
  ] as const;

  for (const [field, label] of stringFields) {
    if (data[field] === undefined) {
      continue;
    }

    if (typeof data[field] !== "string") {
      throw new Error(`${label} must be a string`);
    }

    normalizedData[field] =
      field === "contactEmail"
        ? data[field].trim().toLowerCase()
        : data[field].trim();
  }

  for (const [field, label] of [
    ["companyName", "Company name"],
    ["contactPerson", "Contact person"],
    ["contactEmail", "Contact email"],
  ] as const) {
    if (!partial || normalizedData[field] !== undefined) {
      if (!normalizedData[field]) {
        throw new Error(`${label} is required`);
      }
    }
  }

  if (
    normalizedData.contactEmail !== undefined &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedData.contactEmail)
  ) {
    throw new Error("Invalid contact email");
  }

  return normalizedData;
};

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000;

// Create Client
export const createClient = async (data: any) => {
  const normalizedData = normalizeClientData(data);
  const existingClient = await Client.findOne({
    contactEmail: normalizedData.contactEmail,
  });

  if (existingClient) {
    throw new Error("Client with this email already exists");
  }

  try {
    return await Client.create(normalizedData);
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      throw new Error("Client with this email already exists");
    }

    throw error;
  }
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

  const normalizedData = normalizeClientData(data, true);
  const client = await Client.findById(id);

  if (!client) {
    throw new Error("Client not found");
  }

  if (
    normalizedData.contactEmail !== undefined &&
    normalizedData.contactEmail !== client.contactEmail
  ) {
    const existingClient = await Client.findOne({
      contactEmail: normalizedData.contactEmail,
    });

    if (existingClient) {
      throw new Error("Email already belongs to another client");
    }
  }

  Object.assign(client, normalizedData);
  try {
    await client.save();
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      throw new Error("Email already belongs to another client");
    }

    throw error;
  }

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