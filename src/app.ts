import cors from "cors";
import express, { Application, Request, Response } from "express";
const app: Application = express();

// parser
app.use(express.json());


// apps routes


app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to MediStore Store");
});


export default app;
