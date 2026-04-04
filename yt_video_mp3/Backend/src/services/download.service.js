import { exec } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const sanitizeFileName = (name) => {
    const cleaned = String(name || "ytgrab")
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    return cleaned.slice(0, 120) || "ytgrab";
};

const runYtDlpJson = async (url) => {
    const safeUrl = `"${url.replace(/"/g, '\\"')}"`;
    const { stdout } = await execAsync(`yt-dlp -J --no-playlist ${safeUrl}`, {
        maxBuffer: 30 * 1024 * 1024,
    });
    return JSON.parse(stdout);
};

// Get available video qualities
export const getAvailableQualities = async (url) => {
    // 1. Check URL
    if (!url) throw new Error("URL is required");

    try {
        const data = await runYtDlpJson(url);
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
            webpageUrl: data.webpage_url || url,
        };

        return { qualities, info };
    } catch {
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
    // 1. Validate URL
    if (!url) throw new Error("URL is required");

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

    // 5. Make URL safe
    const safeUrl = `"${url.replace(/"/g, '\\"')}"`;

    // 6. Get title for actual filename
    let mediaTitle = "ytgrab";
    try {
        const { stdout: infoStdout } = await execAsync(`yt-dlp --skip-download --print "%(title)s" ${safeUrl}`, {
            maxBuffer: 10 * 1024 * 1024,
        });
        mediaTitle = sanitizeFileName(infoStdout.split(/\r?\n/)[0]);
    } catch {
        mediaTitle = "ytgrab";
    }

    // 7. Build deterministic output path with real title
    const extension = type === "mp3" ? "mp3" : "mp4";
    let outputFile = path.join(outputDir, `${mediaTitle}.${extension}`);
    if (fs.existsSync(outputFile)) {
        outputFile = path.join(outputDir, `${mediaTitle}_${Date.now()}.${extension}`);
    }
    const command =
        type === "mp3"
            ? `yt-dlp -x --audio-format mp3 --audio-quality ${audioQuality}K --add-metadata --embed-thumbnail -o "${outputFile}" ${safeUrl}`
            : `yt-dlp -f "bestvideo[height<=${quality}]+bestaudio/best" --merge-output-format mp4 --add-metadata --embed-thumbnail -o "${outputFile}" ${safeUrl}`;

    try {
        // 8. Run command and verify created file
        await execAsync(command, { maxBuffer: 20 * 1024 * 1024 });
        if (!fs.existsSync(outputFile)) {
            throw new Error("Downloaded file path not found");
        }

        // 9. Return result
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
        console.log(err); // important for debugging
        throw new Error("Download failed");
    }
}; 
