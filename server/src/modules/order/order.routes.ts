import { Router } from "express";
import { requireAuth, requireRole } from "../../shared/middleware/auth.middleware.js";
import { orderController } from "./order.controller.js";

const router = Router();

router.get("/seller", requireAuth, requireRole("seller", "admin"), orderController.getSellerOrders);
router.get("/seller/:id", requireAuth, requireRole("seller", "admin"), orderController.getSellerOrderById);
router.get("/", requireAuth, orderController.getAll);
router.get("/:id", requireAuth, orderController.getById);
router.post("/", requireAuth, orderController.create);
router.put("/:id/status", requireAuth, requireRole("admin", "seller"), orderController.updateStatus);
router.put("/:id/payment", requireAuth, requireRole("admin"), orderController.updatePaymentStatus);
router.delete("/:id", requireAuth, orderController.delete);

export default router;
