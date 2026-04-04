export default function LoadingPage({ message = "Preparing your download…" }) {
  return (
    <div className="min-h-screen bg-[#050d1a] flex flex-col items-center justify-center font-['Sora',sans-serif]">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-sky-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-sky-400/8 blur-[80px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated ring */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-sky-500/10" />
          {/* Spinning ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "rgba(56,189,248,0.9)",
              borderRightColor: "rgba(56,189,248,0.3)",
              animationDuration: "1.2s",
            }}
          />
          {/* Inner pulse */}
          <div className="absolute inset-3 rounded-full bg-sky-500/10 animate-pulse" />
          {/* Icon center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <p className="text-white font-semibold text-lg">{message}</p>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-56 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-600 to-sky-300 animate-[progressPulse_2s_ease-in-out_infinite]"
            style={{ width: "60%" }}
          />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        @keyframes progressPulse {
          0%   { width: 20%; opacity: 0.6; }
          50%  { width: 80%; opacity: 1; }
          100% { width: 20%; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}