import { Router } from "express";
import {
  createClientController,
  getAllClientsController,
  getClientByIdController,
  updateClientController,
  updateClientStatusController,
  deleteClientController,
} from "../controllers/client.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import {
  createClientSchema,
  updateClientSchema,
  updateClientStatusSchema,
} from "../validators/client.validator";

const router = Router();

// All routes are protected for Super Admin
router.use(authMiddleware);
router.use(authorizeRoles("super_admin"));

// Create Client
router.post(
  "/",
  validateRequest({ body: createClientSchema }),
  createClientController
);

// Get All Clients
router.get("/", getAllClientsController);

// Get Client By ID
router.get("/:id", getClientByIdController);

// Update Client
router.patch(
  "/:id",
  validateRequest({ body: updateClientSchema }),
  updateClientController
);

// Update Client Status
router.patch(
  "/:id/status",
  validateRequest({ body: updateClientStatusSchema }),
  updateClientStatusController
);

// Delete Client
router.delete("/:id", deleteClientController);

export default router;