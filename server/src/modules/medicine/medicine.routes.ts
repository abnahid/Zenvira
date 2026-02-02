import { Router } from "express";
import { requireAuth, requireRole } from "../../shared/middleware/auth.middleware.js";
import { medicineController } from "./medicine.controller.js";

const router = Router();

router.get("/admin", requireAuth, requireRole("admin"), medicineController.getAllForAdmin);
router.get("/", medicineController.getAll);
router.get("/id/:id", requireAuth, requireRole("seller", "admin"), medicineController.getById);
router.get("/:slug", medicineController.getBySlug);
router.post("/", requireAuth, requireRole("seller", "admin"), medicineController.create);
router.put("/:id", requireAuth, requireRole("seller", "admin"), medicineController.update);
router.delete("/:id", requireAuth, requireRole("seller", "admin"), medicineController.delete);

export default router;
