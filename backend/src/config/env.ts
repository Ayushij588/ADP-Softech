import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

JWT_EXPIRES_IN: z.string().default("1d"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  FRONTEND_URL: z.string().default("http://localhost:3000"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

export const env = envSchema.parse(process.env);