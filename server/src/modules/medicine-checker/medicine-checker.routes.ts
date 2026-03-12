import { Router } from "express";
import { medicineCheckerController } from "./medicine-checker.controller.js";

const router = Router();

router.post("/", medicineCheckerController.chat);

export default router;
