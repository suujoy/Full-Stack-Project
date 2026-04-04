import express from "express";
import cookieParser from "cookie-parser";
import handleError from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

//error middleware
app.use(handleError);

export default app;
