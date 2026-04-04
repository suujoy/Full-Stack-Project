export default function FormatToggle({ format, setFormat }) {
  const options = [
    {
      value: "video",
      label: "Video",
      ext: "MP4",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      value: "mp3",
      label: "Audio",
      ext: "MP3",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        Format
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFormat(opt.value)}
            className={`relative flex flex-col items-center gap-1 rounded-2xl border py-3 px-3 transition-all duration-200 active:scale-[0.97] ${
              format === opt.value
                ? "bg-sky-500/15 border-sky-500/50 text-sky-300"
                : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-slate-200"
            }`}
          >
            {format === opt.value && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
            )}
            {opt.icon}
            <span className="font-semibold text-[13px]">{opt.label}</span>
            <span className={`text-[10px] font-bold tracking-widest ${format === opt.value ? "text-sky-500" : "text-slate-600"}`}>
              {opt.ext}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
