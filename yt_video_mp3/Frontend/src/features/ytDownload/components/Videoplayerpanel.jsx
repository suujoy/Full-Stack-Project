function toEmbedUrl(info) {
  const directId = info?.videoId;
  if (directId) return `https://www.youtube.com/embed/${directId}`;

  const rawUrl = info?.webpageUrl || "";
  try {
    const parsed = new URL(rawUrl);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    const id = parsed.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

export default function VideoPlayerPanel({ info }) {
  if (!info) return null;

  const embedUrl = toEmbedUrl(info);

  return (
    <section className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-3 md:p-4 backdrop-blur-sm shadow-2xl shadow-black/30 animate-fadeIn">
      <h3 className="text-sm font-bold text-sky-300 mb-2 tracking-wide uppercase">Video Preview</h3>
      {embedUrl ? (
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
          <iframe
            src={embedUrl}
            title={info.title || "YouTube preview"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video w-full rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 text-sm">
          Preview unavailable
        </div>
      )}
      <p className="mt-2 text-sm text-white/90 line-clamp-2">{info.title || "Untitled"}</p>
      {info.channel && <p className="text-xs text-slate-400 mt-1">{info.channel}</p>}
    </section>
  );
}
