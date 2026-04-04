import { execFile } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
let ytDlpRuntime = null;

const getErrorMessage = (err) => {
    if (!err) return "Unknown error";
    return err.stderr || err.stdout || err.message || String(err);
};

const normalizeUrl = (rawUrl) => {
    const value = String(rawUrl || "").trim();
    if (!value) throw new Error("URL is required");

    let parsed;
    try {
        parsed = new URL(value);
    } catch {
        throw new Error("Invalid URL");
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid URL");
    }

    return parsed.toString();
};

const getYtDlpRuntime = async () => {
    if (ytDlpRuntime) return ytDlpRuntime;

    const candidates = [
        { cmd: "yt-dlp", baseArgs: [] },
        { cmd: "python3", baseArgs: ["-m", "yt_dlp"] },
        { cmd: "python", baseArgs: ["-m", "yt_dlp"] },
    ];

    for (const candidate of candidates) {
        try {
            await execFileAsync(candidate.cmd, [...candidate.baseArgs, "--version"], {
                timeout: 15000,
                windowsHide: true,
            });
            ytDlpRuntime = candidate;
            return ytDlpRuntime;
        } catch {
            // Try next candidate
        }
    }

    throw new Error(
        "yt-dlp is not available. Install it and ensure either `yt-dlp`, `python3 -m yt_dlp`, or `python -m yt_dlp` works.",
    );
};

const runYtDlp = async (args, options = {}) => {
    const runtime = await getYtDlpRuntime();
    return execFileAsync(runtime.cmd, [...runtime.baseArgs, ...args], {
        maxBuffer: 30 * 1024 * 1024,
        windowsHide: true,
        ...options,
    });
};

const sanitizeFileName = (name) => {
    const cleaned = String(name || "ytgrab")
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    return cleaned.slice(0, 120) || "ytgrab";
};

const runYtDlpJson = async (url) => {
    const { stdout } = await runYtDlp(["-J", "--no-playlist", url], {
        maxBuffer: 30 * 1024 * 1024,
    });
    return JSON.parse(stdout);
};

// Get available video qualities
export const getAvailableQualities = async (url) => {
    const normalizedUrl = normalizeUrl(url);

    try {
        const data = await runYtDlpJson(normalizedUrl);
        const qualities = [
            ...new Set(
                (data.formats || [])
                    .map((f) => Number(f.height))
                    .filter((h) => Number.isFinite(h) && h >= 144 && h <= 2160)
                    .map((h) => String(h)),
            ),
        ].sort((a, b) => Number(a) - Number(b));

        const info = {
            title: data.title || "",
            thumbnail: data.thumbnail || "",
            duration: Number.isFinite(data.duration) ? Math.round(data.duration) : null,
            channel: data.uploader || data.channel || "",
            views: Number.isFinite(data.view_count) ? data.view_count : null,
            videoId: data.id || "",
            webpageUrl: data.webpage_url || normalizedUrl,
        };

        return { qualities, info };
    } catch (err) {
        console.error("getAvailableQualities failed:", getErrorMessage(err));
        throw new Error("Failed to fetch qualities");
    }
};

// Download media (video or mp3)
export const downloadMedia = async (
    url,
    type = "video",
    quality = "480",
    audioQuality = "128"
) => {
    const normalizedUrl = normalizeUrl(url);

    // 2. Validate video quality
    const allowedQualities = ["144", "240", "360", "480", "720", "1080"];
    if (!allowedQualities.includes(quality)) {
        quality = "480"; // fallback
    }

    // 3. Validate audio quality
    const allowedAudio = ["64", "128", "192", "256", "320"];
    if (!allowedAudio.includes(audioQuality)) {
        audioQuality = "128"; // fallback
    }

    // 4. Decide folder
    const outputDir = path.join(os.tmpdir(), "yt_video_mp3", type === "mp3" ? "audio" : "video");

    fs.mkdirSync(outputDir, { recursive: true });

    // 5. Get title for actual filename
    let mediaTitle = "ytgrab";
    try {
        const { stdout: infoStdout } = await runYtDlp(["--skip-download", "--print", "%(title)s", normalizedUrl], {
            maxBuffer: 10 * 1024 * 1024,
        });
        mediaTitle = sanitizeFileName(infoStdout.split(/\r?\n/)[0]);
    } catch {
        mediaTitle = "ytgrab";
    }

    // 6. Build deterministic output path with real title
    const extension = type === "mp3" ? "mp3" : "mp4";
    let outputFile = path.join(outputDir, `${mediaTitle}.${extension}`);
    if (fs.existsSync(outputFile)) {
        outputFile = path.join(outputDir, `${mediaTitle}_${Date.now()}.${extension}`);
    }
    const args =
        type === "mp3"
            ? [
                "-x",
                "--audio-format",
                "mp3",
                "--audio-quality",
                `${audioQuality}K`,
                "--add-metadata",
                "--embed-thumbnail",
                "-o",
                outputFile,
                normalizedUrl,
            ]
            : [
                "-f",
                `bestvideo[height<=${quality}]+bestaudio/best`,
                "--merge-output-format",
                "mp4",
                "--add-metadata",
                "--embed-thumbnail",
                "-o",
                outputFile,
                normalizedUrl,
            ];

    try {
        // 7. Run command and verify created file
        await runYtDlp(args, { maxBuffer: 20 * 1024 * 1024 });
        if (!fs.existsSync(outputFile)) {
            throw new Error("Downloaded file path not found");
        }

        // 8. Return result
        return {
            path: outputFile,
            fileName: path.basename(outputFile),
            type,
            quality:
                type === "mp3"
                    ? `${audioQuality}kbps`
                    : `${quality}p`,
        };

    } catch (err) {
        console.error("downloadMedia failed:", getErrorMessage(err));
        throw new Error("Download failed");
    }
}; 
