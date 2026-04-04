const AUDIO_QUALITIES = ["64", "128", "192", "256", "320"];

const getVideoTier = (quality) => {
  const q = Number(quality);
  if (q >= 4320) return "8K UHD";
  if (q >= 2160) return "4K UHD";
  if (q >= 1440) return "2K QHD";
  if (q >= 1080) return "Full HD";
  if (q >= 720) return "HD";
  if (q >= 480) return "SD";
  return "Low";
};

const getTierBadge = (quality) => {
  const q = Number(quality);
  if (q >= 4320) return "8K";
  if (q >= 2160) return "4K";
  if (q >= 1440) return "2K";
  if (q >= 1080) return "FHD";
  if (q >= 720) return "HD";
  if (q >= 480) return "SD";
  return "LOW";
};

export default function QualitySelector({
  format,
  qualities,
  selectedQuality,
  setSelectedQuality,
  audioQuality,
  setAudioQuality,
}) {
  if (format === "mp3") {
    return (
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Audio Bitrate
        </label>
        <div className="flex flex-wrap gap-2">
          {AUDIO_QUALITIES.map((q) => (
            <button
              key={q}
              onClick={() => setAudioQuality(q)}
              className={`flex-1 min-w-[56px] rounded-xl border py-2 text-[13px] font-semibold transition-all duration-200 active:scale-95 ${
                audioQuality === q
                  ? "bg-sky-500/20 border-sky-400/60 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                  : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:bg-white/[0.06] hover:border-white/10 hover:text-white"
              }`}
            >
              {q}
              <span className="text-[10px] font-normal ml-0.5">kbps</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        Video Quality
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {qualities.map((q) => {
          const numericQuality = Number(q);
          const tierLabel = getVideoTier(numericQuality);
          const tierBadge = getTierBadge(numericQuality);
          return (
            <button
              key={q}
              onClick={() => setSelectedQuality(q)}
              className={`relative rounded-xl border py-2.5 px-2 text-center transition-all duration-200 active:scale-95 ${
                selectedQuality === q
                  ? "bg-sky-500/20 border-sky-400/60 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                  : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:bg-white/[0.06] hover:border-white/10 hover:text-white"
              }`}
            >
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wider">
                {tierBadge}
              </span>
              <div className="font-bold text-sm">{q}p</div>
              <div className={`text-[10px] mt-0.5 ${selectedQuality === q ? "text-sky-500/70" : "text-slate-600"}`}>
                {tierLabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
