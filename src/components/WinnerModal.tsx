import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, X, Sparkles } from 'lucide-react';
import { Team } from '../types';

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  onClose,
  teams,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#10B981', '#F59E0B'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#3B82F6', '#EC4899'],
          });
        }, 250);
      } catch {
        // Silently continue
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sort teams by netScore descending
  const sorted = [...teams].sort((a, b) => b.netScore - a.netScore);
  const topTeam = sorted[0];
  const topNet = topTeam ? topTeam.netScore : 0;
  const isTiedForFirst =
    sorted.length > 1 && sorted[1].netScore === topNet;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-slate-100 flex flex-col gap-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="winner-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2
                id="winner-title"
                className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase"
              >
                Challenge Standings
              </h2>
              <p className="text-xs sm:text-sm text-amber-300 font-semibold tracking-wide">
                English Classroom Competition Leaderboard
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Podium Spotlight */}
        {topTeam && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-emerald-950/30 border border-amber-400/40 p-5 sm:p-6 text-center flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {isTiedForFirst ? 'Tied for 1st Place' : 'Current Champion'}
            </div>

            <div className="text-5xl my-1 select-none">
              {topNet > 0 ? '😊' : topNet < 0 ? '😟' : '😐'}
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight my-1">
              {topTeam.name}
            </h3>

            <div className="mt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Net Score
              </span>
              <span className="font-mono-numbers text-4xl sm:text-5xl font-black text-amber-400">
                {topNet > 0 ? `+${topNet}` : topNet}
              </span>
            </div>
          </div>
        )}

        {/* Full Roster Standings Table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            <span>Rank & Team</span>
            <div className="flex items-center gap-6">
              <span className="w-20 text-center">Mood</span>
              <span className="w-24 text-right text-amber-300">Net Score</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {sorted.map((t, idx) => {
              const net = t.netScore;
              const isFirst = idx === 0;
              const face = net > 0 ? '😊' : net < 0 ? '😟' : '😐';

              return (
                <div
                  key={t.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isFirst
                      ? 'bg-amber-500/10 border-amber-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono-numbers font-black text-xs shrink-0 ${
                        isFirst
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-950'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-sm sm:text-base truncate">
                      {t.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 font-mono-numbers text-sm font-bold">
                    <span className="w-20 text-center text-xl select-none">
                      {face}
                    </span>
                    <span
                      className={`w-24 text-right font-black text-lg ${
                        net > 0
                          ? 'text-emerald-400'
                          : net < 0
                          ? 'text-rose-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {net > 0 ? `+${net}` : net}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            Back to Scoreboard
          </button>
        </div>
      </div>
    </div>
  );
};
