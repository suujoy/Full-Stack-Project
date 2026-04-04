import ytdl from "@distube/ytdl-core";
const agent = ytdl.createAgent();

import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

export const getVideoInfo = async (req, res) => {
    try {
        const { url } = req.query;

        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).json({ error: "Invalid YouTube URL" });
        }

        const info = await ytdl.getBasicInfo(url);

        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails.at(-1)?.url,
            duration: info.videoDetails.lengthSeconds,
        });
    } catch (error) {
        console.log("ERROR:", error.message);
        res.status(500).json({ error: "Failed to fetch video info" });
    }
};

export const downloadVideo = async (req, res) => {
    try {
        const { url, quality } = req.query;

        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).send("Invalid YouTube URL");
        }

        const info = await ytdl.getInfo(url, { agent });

        let formats = ytdl.filterFormats(info.formats, "videoandaudio");

        let selectedFormat;

        if (quality) {
            selectedFormat = formats.find((f) => f.qualityLabel === quality);
        }

        if (!selectedFormat) {
            selectedFormat =
                formats
                    .filter((f) => f.bitrate)
                    .sort((a, b) => b.bitrate - a.bitrate)[0] || formats[0];
        }

        const safeTitle = info.videoDetails.title.replace(/[^\w\s]/gi, "");

        res.header(
            "Content-Disposition",
            `attachment; filename="${safeTitle}.mp4"`,
        );
        res.header("Content-Type", "video/mp4");

        ytdl(url, { format: selectedFormat, agent }).pipe(res);
    } catch (error) {
        console.log("VIDEO ERROR:", error.message);
        res.status(500).send("Download failed");
    }
};

export const downloadAudio = async (req, res) => {
    try {
        const { url } = req.query;

        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).send("Invalid URL");
        }

        const info = await ytdl.getInfo(url, { agent });

        const safeTitle = info.videoDetails.title.replace(/[^\w\s]/gi, "");

        res.header(
            "Content-Disposition",
            `attachment; filename="${safeTitle}.mp3"`,
        );
        res.header("Content-Type", "audio/mpeg");

        const stream = ytdl(url, { filter: "audioonly", agent });

        ffmpeg(stream).audioBitrate(128).format("mp3").pipe(res);
    } catch (error) {
        console.log("AUDIO ERROR:", error.message);
        res.status(500).send("Audio download failed");
    }
};
