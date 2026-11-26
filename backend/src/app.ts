import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import clientRoutes from "./routes/client.routes";
import userRoutes from "./routes/user.routes";
import jobRoutes from "./routes/job.routes";
import candidateRoutes from "./routes/candidate.routes";
import applicationRoutes from "./routes/application.routes";
import applicationNoteRoutes from "./routes/applicationNote.routes";
const app: Application = express();


// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ADP-Softech Backend is running!"
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "ADP-Softech Backend",
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// User routes
app.use("/api/users", userRoutes);

// Client routes
app.use("/api/clients", clientRoutes);

// job routes
app.use("/api/jobs", jobRoutes);

// candidate routes
app.use("/api/candidates", candidateRoutes);

// application routes
app.use("/api/applications", applicationRoutes);

//applicaton notes
app.use("/api/application-notes", applicationNoteRoutes);

export default app;