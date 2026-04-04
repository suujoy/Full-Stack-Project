import axios from "axios";

const downloadApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export const getQualities = async (url) => {
    const { data } = await downloadApi.get("/api/media/qualities", {
        params: { url, t: Date.now() },
        headers: {
            "Cache-Control": "no-cache",
        },
    });
    return data;
};

export const downloadMedia = async ({ url, type, quality, audioQuality, onProgress }) => {
    const { data, headers } = await downloadApi.get("/api/media/download", {
        params: { url, type, quality, audioQuality },
        responseType: "blob",
        onDownloadProgress: (event) => {
            if (!onProgress) return;
            const total = event.total || 0;
            const percent = total > 0
                ? Math.max(0, Math.min(100, Math.round((event.loaded * 100) / total)))
                : 0;
            onProgress(percent);
        },
    });

    const headerFileName = headers["x-download-filename"];
    const disposition = headers["content-disposition"] || "";
    const utf8Name = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
    const basicName = disposition.match(/filename="?([^"]+)"?/i)?.[1];
    const candidate = headerFileName || utf8Name || basicName || `download.${type === "mp3" ? "mp3" : "mp4"}`;
    let filename = candidate;
    try {
        filename = decodeURIComponent(candidate);
    } catch {
        filename = candidate;
    }

    return { blob: data, filename };
};
