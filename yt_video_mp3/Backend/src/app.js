import express from "express";
import { exec } from "child_process";
import fs from "fs";
import mediaRouter from "./routes/media.routes.js";
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        exposedHeaders: ["Content-Disposition", "X-Download-Filename", "Content-Length"],
    }),
);

app.use("/api/media", mediaRouter);

export default app;
