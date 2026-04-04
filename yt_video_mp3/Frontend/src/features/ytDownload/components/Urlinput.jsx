export default function UrlInput({ url, setUrl, onFetch, loading, isValid, onReset, hasResult }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) onFetch();
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        YouTube URL
      </label>
      <div className="relative flex items-center group">
        {/* YT icon */}
        <div className="absolute left-4 text-slate-500 group-focus-within:text-sky-400 transition-colors duration-200">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-sky-500/60 focus:bg-white/[0.06] text-white placeholder-slate-600 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-sky-500/20"
        />

        {/* Clear button */}
        {url && (
          <button
            onClick={onReset}
            className="absolute right-4 text-slate-600 hover:text-slate-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Validation hint */}
      {url && !isValid && (
        <p className="text-xs text-amber-500/80 pl-1">
          Enter a valid YouTube URL (youtube.com or youtu.be)
        </p>
      )}

      {/* Fetch button */}
      <button
        onClick={onFetch}
        disabled={loading || !url || !isValid}
        className="w-full flex items-center justify-center gap-2 bg-sky-500/15 hover:bg-sky-500/25 disabled:opacity-40 disabled:cursor-not-allowed border border-sky-500/30 hover:border-sky-500/50 text-sky-400 font-semibold rounded-2xl py-2.5 text-sm transition-all duration-200 active:scale-[0.98]"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Analyzing video…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            {hasResult ? "Re-fetch Qualities" : "Fetch Qualities"}
          </>
        )}
      </button>
    </div>
  );
}
