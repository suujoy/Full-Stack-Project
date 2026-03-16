import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";
import roomRouter from "./routes/unifiedRoom.route.js";
import handleError from "./middlewares/error.middleware.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    }),
);

// API routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/room", roomRouter);

// Serve React frontend static files
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

// Catch-all: let React Router handle client-side routes
app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist", "index.html"));
});

app.use(handleError);

export default app;
