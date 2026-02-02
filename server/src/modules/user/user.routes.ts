import { Router } from "express";
import { requireAuth, requireRole } from "../../shared/middleware/auth.middleware.js";
import { userController } from "./user.controller.js";

const router = Router();

// Seller application routes
router.post("/seller/apply", requireAuth, userController.submitSellerApplication);
router.get("/seller/application", requireAuth, userController.getMySellerApplication);
router.get("/seller-applications", requireAuth, requireRole("admin"), userController.getAllSellerApplications);
router.put("/seller-applications/:id", requireAuth, requireRole("admin"), userController.updateSellerApplicationStatus);

// Current user profile routes - MUST be before /:id routes
router.get("/me", requireAuth, userController.getMyProfile);
router.put("/me", requireAuth, userController.updateMyProfile);

// Admin user management routes
router.get("/", requireAuth, requireRole("admin"), userController.getAllUsers);
router.get("/:id", requireAuth, requireRole("admin"), userController.getUserById);
router.put("/:id", requireAuth, requireRole("admin"), userController.updateUser);
router.delete("/:id", requireAuth, requireRole("admin"), userController.deleteUser);

export default router;
