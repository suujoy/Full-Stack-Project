import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import {
    loginValidator,
    registerValidator,
} from "../validation/auth.validate.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);

authRouter.post("/login", loginValidator, login);

export default authRouter;
