import { Router } from "express";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { reviewController } from "./review.controller.js";

const router = Router();

router.get("/", reviewController.getAll);
router.get("/medicine/:medicineId", reviewController.getByMedicineId);
router.get("/:id", reviewController.getById);
router.post("/", requireAuth, reviewController.create);
router.put("/:id", requireAuth, reviewController.update);
router.delete("/:id", requireAuth, reviewController.delete);

export default router;
