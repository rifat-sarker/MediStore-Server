import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./app/routes";
const app: Application = express();

// parser
app.use(express.json());

// apps routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to MediStore Store");
});

export default app;
