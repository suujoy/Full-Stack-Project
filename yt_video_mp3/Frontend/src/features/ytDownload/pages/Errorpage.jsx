export default function ErrorPage({
    title = "Something went wrong",
    message = "We couldn't complete your request. Please try again.",
    onRetry,
    onGoHome,
}) {
    return (
        <div className="min-h-screen bg-[#050d1a] flex flex-col items-center justify-center px-4 font-['Sora',sans-serif]">
            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-red-500/5 blur-[100px]" />
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-sky-500/5 blur-[80px]" />
            </div>

            <div className="relative flex flex-col items-center gap-8 max-w-sm w-full text-center">
                {/* Error icon */}
                <div className="relative">
                    {/* Outer ring */}
                    <div className="w-24 h-24 rounded-full border border-red-500/20 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-full bg-red-500/5 blur-xl" />
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h1 className="text-2xl font-black text-white">{title}</h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98]"
                            style={{
                                background:
                                    "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                                boxShadow: "0 0 24px rgba(14,165,233,0.3)",
                            }}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Try Again
                        </button>
                    )}
                    {onGoHome && (
                        <button
                            onClick={onGoHome}
                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:text-white transition-all duration-200 active:scale-[0.98]"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Back to Home
                        </button>
                    )}
                </div>

                {/* Error code hint */}
                <p className="text-slate-700 text-xs">
                    If this keeps happening, check your network or the YouTube
                    URL.
                </p>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;900&display=swap');
      `}</style>
        </div>
    );
}
