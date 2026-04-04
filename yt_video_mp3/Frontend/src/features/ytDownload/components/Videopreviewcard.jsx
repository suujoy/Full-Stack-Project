export default function VideoPreviewCard({ info }) {
  if (!info) return null;

  const { title, thumbnail, duration, channel, views } = info;

  const formatViews = (n) => {
    if (!n) return null;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`;
    return `${n} views`;
  };

  const formatDuration = (sec) => {
    if (!sec) return null;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="flex gap-4 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 animate-fadeIn">
      {/* Thumbnail */}
      {thumbnail && (
        <div className="relative shrink-0 w-28 h-16 rounded-xl overflow-hidden bg-white/5">
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          {duration && (
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              {formatDuration(duration)}
            </span>
          )}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <p className="text-sm font-semibold text-white leading-tight line-clamp-2">
          {title || "Untitled"}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {channel && (
            <span className="text-xs text-sky-400 font-medium">{channel}</span>
          )}
          {views && (
            <span className="text-xs text-slate-500">{formatViews(views)}</span>
          )}
        </div>
      </div>
    </div>
  );
}