"use client";

interface ProgressIndicatorProps {
  progress: number;
}

export default function ProgressIndicator({
  progress,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col items-end gap-1">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {progress}%
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Complete
        </span>
      </div>
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 p-1 flex items-center justify-center">
        <div className="relative w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-200 dark:text-slate-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray={`${2.827 * progress} 282.7`}
              strokeLinecap="round"
              className="transition-all duration-500"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-xs font-bold text-slate-900 dark:text-white">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
