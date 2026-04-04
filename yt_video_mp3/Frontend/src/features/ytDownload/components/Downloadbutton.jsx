export default function DownloadButton({ onClick, loading, format, progress = 0 }) {
  const isAudio = format === "mp3";
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="relative w-full group overflow-hidden rounded-2xl py-3 font-bold text-[13px] tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
      style={{
        background: loading
          ? "rgba(14,165,233,0.2)"
          : "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #0284c7 100%)",
        boxShadow: loading ? "none" : "0 0 30px rgba(14,165,233,0.35), 0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      {loading && (
        <span
          className="absolute inset-y-0 left-0 bg-sky-500/60 transition-all duration-150"
          style={{ width: `${safeProgress}%` }}
        />
      )}

      {!loading && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      )}

      <span className="relative flex items-center justify-center gap-2 text-white">
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {`Downloading ${safeProgress}%`}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d={
                  isAudio
                    ? "M9 19V6l12-3v13M9 19a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0z"
                    : "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                }
              />
            </svg>
            Download {isAudio ? "MP3" : "MP4"}
          </>
        )}
      </span>
    </button>
  );
}
