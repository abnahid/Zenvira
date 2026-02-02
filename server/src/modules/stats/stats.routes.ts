import { Router } from "express";
import { requireAuth, requireRole } from "../../shared/middleware/auth.middleware.js";
import { statsController } from "./stats.controller.js";

const router = Router();

router.get("/seller", requireAuth, requireRole("seller", "admin"), statsController.getSellerStats);
router.get("/admin", requireAuth, requireRole("admin"), statsController.getAdminStats);

export default router;
