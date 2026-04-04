import { getAvailableQualities, downloadMedia } from "../services/download.service.js";
import fsSync from "fs";
import fs from "fs/promises";

const getStatusCode = (message = "") => {
    if (message.includes("URL is required") || message.includes("Invalid URL")) {
        return 400;
    }
    return 500;
};

// Get video qualities
export const getQualitiesController = async (req, res) => {
    try {
        const { url } = req.query;

        const result = await getAvailableQualities(url);

        res.status(200).json(result);

    } catch (err) {
        res.status(getStatusCode(err?.message)).json({ error: err.message });
    }
};


// Download media
export const downloadController = async (req, res) => {
    try {
        const { url, type, quality, audioQuality } = req.query;

        const result = await downloadMedia(
            url,
            type,
            quality,
            audioQuality
        );

        const stats = await fs.stat(result.path);

        res.setHeader("Content-Length", stats.size);
        res.setHeader("Content-Type", type === "mp3" ? "audio/mpeg" : "video/mp4");
        res.setHeader("X-Download-Filename", encodeURIComponent(result.fileName));

        const readStream = fsSync.createReadStream(result.path);
        readStream.on("error", () => {
            if (!res.headersSent) {
                res.status(500).json({ error: "Failed to stream file" });
            } else {
                res.destroy();
            }
        });

        res.setHeader("Content-Disposition", `attachment; filename="${result.fileName}"`);
        readStream.pipe(res);

        res.on("finish", async () => {
            try {
                await fs.unlink(result.path);
            } catch {
                // ignore cleanup failures
            }
        });

    } catch (err) {
        res.status(getStatusCode(err?.message)).json({ error: err.message });
    }
};
