import { Router } from "express";
import {
    downloadAudio,
    downloadVideo,
    getVideoInfo,
} from "../controllers/download.controller.js";

const downloadRouter = Router();

downloadRouter.get("/info", getVideoInfo);

downloadRouter.get("/download-video", downloadVideo);

downloadRouter.get("/download-audio", downloadAudio);

export default downloadRouter;
