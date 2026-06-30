import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import config from "./app/config";

const app: Application = express();

// ─── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parsers (JSON only — no form-data here) ───────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🏥 MediStore API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1", router);

// ─── Error Handlers ──────────────────────────────────────────────────────────
app.use(globalErrorHandler);
app.use(notFound);

export default app;
