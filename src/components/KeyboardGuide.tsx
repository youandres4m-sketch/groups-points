import React from 'react';

interface KeyboardGuideProps {
  totalTeams: number;
  selectedTeamId: number | null;
  winningCount: number;
  tiedCount: number;
  losingCount: number;
  classNetScore: number;
}

export const KeyboardGuide: React.FC<KeyboardGuideProps> = ({
  totalTeams,
  selectedTeamId,
  winningCount,
  tiedCount,
  losingCount,
  classNetScore,
}) => {
  return (
    <footer className="w-full bg-slate-900/95 border-t border-slate-800 px-4 py-2.5 sm:py-3 select-none z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Permanent Keyboard Shortcut Strip */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-300">
          {/* 1-9 Select Team */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 px-2 py-1 rounded-md border border-slate-800">
            <kbd className="font-mono-numbers px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-extrabold text-xs shadow-xs border border-slate-700">
              1–{totalTeams}
            </kbd>
            <span className="text-slate-300">SELECT / FOCUS</span>
          </div>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* C +1 Correct */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 px-2 py-1 rounded-md border border-slate-800">
            <kbd className="font-mono-numbers px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-600/50 text-emerald-400 font-extrabold text-xs shadow-xs">
              C
            </kbd>
            <span className="text-emerald-400 font-bold">+1 CORRECT</span>
          </div>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* N -1 Incorrect */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 px-2 py-1 rounded-md border border-slate-800">
            <kbd className="font-mono-numbers px-1.5 py-0.5 rounded bg-rose-950 border border-rose-600/50 text-rose-400 font-extrabold text-xs shadow-xs">
              N
            </kbd>
            <span className="text-rose-400 font-bold">−1 INCORRECT</span>
          </div>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* U Undo */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 px-2 py-1 rounded-md border border-slate-800">
            <kbd className="font-mono-numbers px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-extrabold text-xs shadow-xs border border-slate-700">
              U
            </kbd>
            <span className="text-slate-400">UNDO</span>
          </div>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* F Fullscreen */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 px-2 py-1 rounded-md border border-slate-800">
            <kbd className="font-mono-numbers px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-extrabold text-xs shadow-xs border border-slate-700">
              F
            </kbd>
            <span className="text-slate-400">FULLSCREEN</span>
          </div>
        </div>

        {/* Aggregate Classroom Statistics */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold">😊 {winningCount}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 font-bold">😐 {tiedCount}</span>
            <span className="text-slate-500">·</span>
            <span className="text-rose-400 font-bold">😟 {losingCount}</span>
          </div>

          <div className="h-3 w-px bg-slate-700" />

          <div className="flex items-center gap-1.5">
            <span>Class Total:</span>
            <span
              className={`font-mono-numbers font-black ${
                classNetScore > 0
                  ? 'text-emerald-400'
                  : classNetScore < 0
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              {classNetScore > 0 ? `+${classNetScore}` : classNetScore}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
