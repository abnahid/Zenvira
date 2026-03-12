import type { Request, Response } from "express";
import { medicineCheckerService } from "./medicine-checker.service.js";

export const medicineCheckerController = {
  async chat(req: Request, res: Response) {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== "string" || !message.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Message is required" });
      }

      const reply = await medicineCheckerService.chat(
        message.trim(),
        history || [],
      );

      return res.json({ success: true, data: { reply } });
    } catch (error) {
      console.error("Medicine checker error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to process your question" });
    }
  },
};
