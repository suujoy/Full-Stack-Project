import { useState } from "react";
import UrlInput from "../components/Urlinput";
import QualitySelector from "../components/Qualityselector";
import DownloadButton from "../components/Downloadbutton";
import FormatToggle from "../components/Formattoggle";
import VideoPreviewCard from "../components/Videopreviewcard";
import VideoPlayerPanel from "../components/Videoplayerpanel";
import { useDownload } from "../hooks/useDownload";

export default function DownloadPage() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("video"); // "video" | "mp3"
  const [qualities, setQualities] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [audioQuality, setAudioQuality] = useState("128");
  const [fetchingQualities, setFetchingQualities] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  const { handleGetQualities, handleDownloadMedia } = useDownload();

  const isValidYouTubeUrl = (val) =>
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(val);

  const sanitizeFileName = (name) =>
    String(name || "")
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const handleFetchQualities = async () => {
    if (!url || !isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL.");
      return;
    }
    setError("");
    setSuccess(false);
    setQualities([]);
    setSelectedQuality("");
    setVideoInfo(null);
    setFetchingQualities(true);
    try {
      const data = await handleGetQualities(url);
      setQualities(data.qualities || []);
      setSelectedQuality(data.qualities?.[0] || "");
      setVideoInfo(data.info || null);
    } catch {
      setError("Failed to fetch qualities. Check the URL and try again.");
    } finally {
      setFetchingQualities(false);
    }
  };

  const handleDownload = async () => {
    if (!url) return;
    setError("");
    setSuccess(false);
    setDownloading(true);
    setDownloadProgress(0);
    try {
      const { blob, filename } = await handleDownloadMedia({
        url,
        type: format,
        quality: selectedQuality,
        audioQuality,
        onProgress: setDownloadProgress,
      });

      // Let user choose exact folder/location via native save dialog when supported.
      const extension = format === "mp3" ? ".mp3" : ".mp4";
      const titleFallback = sanitizeFileName(videoInfo?.title);
      const fallbackName = titleFallback ? `${titleFallback}${extension}` : `download_${Date.now()}${extension}`;
      const finalName = filename && !/^download(\.|$)/i.test(filename) ? filename : fallbackName;

      if ("showSaveFilePicker" in window) {
        const handle = await window.showSaveFilePicker({
          suggestedName: finalName,
          types: [
            {
              description: format === "mp3" ? "MP3 Audio" : "MP4 Video",
              accept: {
                [format === "mp3" ? "audio/mpeg" : "video/mp4"]: [extension],
              },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = finalName;
        link.click();
        URL.revokeObjectURL(link.href);
      }

      setSuccess(true);
      setDownloadProgress(100);
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
      setTimeout(() => setDownloadProgress(0), 300);
    }
  };

  const handleReset = () => {
    setUrl("");
    setQualities([]);
    setSelectedQuality("");
    setError("");
    setSuccess(false);
    setDownloadProgress(0);
    setVideoInfo(null);
    setFormat("video");
    setAudioQuality("128");
  };

  return (
    <div className="min-h-screen lg:h-screen bg-[#050d1a] text-white font-['Sora',sans-serif] overflow-x-hidden lg:overflow-hidden">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-sky-400/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-sky-600/5 blur-[140px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(125,211,252,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1700px] mx-auto px-3 md:px-5 xl:px-8 py-3 md:py-4 lg:py-3">
        <div className="grid grid-cols-1 lg:grid-cols-[28%_72%] gap-4 xl:gap-6 items-start">
          {/* Branding panel */}
          <aside className="lg:sticky lg:top-8">
            <div className="w-full max-w-[460px] mx-auto lg:mx-0 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1 text-sky-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                Free - Fast - No Signup
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-none mb-2">
                <span className="text-white">YT</span>
                <span className="text-sky-400">Grab</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
                Download YouTube videos and audio in seconds. Pick your quality and save exactly where you want.
              </p>
            </div>
          </aside>

          {/* Main functionality panel */}
          <main className="w-full">
            <div className="w-full max-w-[1160px] mx-auto lg:mr-0 lg:ml-auto grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-3">
              <div className="order-2 xl:order-1 bg-white/[0.03] border border-white/[0.08] rounded-3xl p-3 sm:p-4 md:p-5 backdrop-blur-sm shadow-2xl shadow-black/40 space-y-3">
                {/* URL Input */}
                <UrlInput
                  url={url}
                  setUrl={setUrl}
                  onFetch={handleFetchQualities}
                  loading={fetchingQualities}
                  isValid={isValidYouTubeUrl(url)}
                  onReset={handleReset}
                  hasResult={qualities.length > 0}
                />

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-3 py-2 text-red-400 text-xs animate-fadeIn">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-3 py-2 text-emerald-400 text-xs animate-fadeIn">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Download completed. You can play it from your selected folder.
                  </div>
                )}

                {/* Video preview */}
                {videoInfo && <VideoPreviewCard info={videoInfo} />}

                {/* Format + Quality selectors - show only after fetch */}
                {qualities.length > 0 && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="h-px bg-white/[0.06]" />

                    <FormatToggle format={format} setFormat={setFormat} />

                    <QualitySelector
                      format={format}
                      qualities={qualities}
                      selectedQuality={selectedQuality}
                      setSelectedQuality={setSelectedQuality}
                      audioQuality={audioQuality}
                      setAudioQuality={setAudioQuality}
                    />

                    <DownloadButton
                      onClick={handleDownload}
                      loading={downloading}
                      format={format}
                      progress={downloadProgress}
                    />
                  </div>
                )}
              </div>

              {videoInfo && (
                <div className="order-1 xl:order-2">
                  <VideoPlayerPanel info={videoInfo} />
                </div>
              )}
            </div>

            {/* Footer */}
            <p className="mt-5 text-slate-600 text-[11px] text-center lg:text-left">
              For personal use only - Respect content creators' rights
            </p>
          </main>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.35s ease forwards; }
      `}</style>
    </div>
  );
}
