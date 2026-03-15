import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";
import handleError from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    }),
);

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(handleError);

export default app;
