import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { auth } from "./lib/auth.js";
import categoryRoutes from "./routes/category.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import reviewRoutes from "./routes/review.routes.js";
dotenv.config();
const app = express();
app.use(cors({
    origin: process.env.TRUSTED_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
// Handle better-auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "MediStore API" });
});
app.use("/api/medicines", medicineRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
// Error handling middleware (last)
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
});
// Only start server if not in Vercel
if (process.env.VERCEL !== "1") {
    app.listen(5000, () => {
        console.log("🚀 Server running on http://localhost:5000");
        console.log("📧 API endpoints:");
        console.log("   - POST /api/auth/sign-up/email");
        console.log("   - POST /api/auth/sign-in/email");
        console.log("   - POST /api/auth/sign-out");
        console.log("   - GET /api/auth/session");
        console.log("   - GET /api/medicines");
        console.log("   - GET /health");
    });
}
export default app;
//# sourceMappingURL=index.js.map