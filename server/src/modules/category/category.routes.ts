import { Router } from "express";
import { requireAuth, requireRole } from "../../shared/middleware/auth.middleware.js";
import { categoryController } from "./category.controller.js";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post("/", requireAuth, requireRole("admin"), categoryController.create);
router.put("/:id", requireAuth, requireRole("admin"), categoryController.update);
router.delete("/:id", requireAuth, requireRole("admin"), categoryController.delete);

export default router;
