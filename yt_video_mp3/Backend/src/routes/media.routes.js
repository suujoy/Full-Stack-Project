import express from "express";
import {
    getQualitiesController,
    downloadController,
} from "../controllers/media.controller.js";

const mediaRouter = express.Router();

/**
 * @route GET /api/media/qualities?url=VIDEO_URL
 * @desc Get available video qualities for a given URL
 * @query {string} url - The URL of the video
 * @returns {object} - List of available qualities
 */
mediaRouter.get("/qualities", getQualitiesController);

/**
 * @route GET /api/media/download?url=VIDEO_URL&type=video&quality=720&audioQuality=128
 * @desc Download media (video or mp3) with specified options
 * @query {string} url - The URL of the video
 * @query {string} type - The type of media (video or mp3)
 * @query {string} quality - The desired video quality
 * @query {string} audioQuality - The desired audio quality (for mp3 downloads)
 */
mediaRouter.get("/download", downloadController);

export default mediaRouter;
