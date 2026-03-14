import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

export default app;
