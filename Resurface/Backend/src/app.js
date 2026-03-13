import express from "express";
import cookieParser from "cookie-parser";
import { handleError } from "./middlewares/error.middleware.js";
import linkRouter from "./routes/link.route.js";

const app = express();

app.use(express.json());

/**
 * Routers
 */
app.use("/api/link", linkRouter);

/**
 * error handler middleware
 */
app.use(handleError);

export default app;
