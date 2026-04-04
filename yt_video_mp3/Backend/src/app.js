import express from "express";
import cors from "cors";
import path from "path";
import mediaRouter from "./routes/media.routes.js";

const app = express();

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        exposedHeaders: [
            "Content-Disposition",
            "X-Download-Filename",
            "Content-Length",
        ],
    }),
);

// API routes
app.use("/api/media", mediaRouter);

// Serve frontend build
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "../Frontend/dist");

app.use(express.static(frontendPath));

// React/Vite fallback route
app.get("*name", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
