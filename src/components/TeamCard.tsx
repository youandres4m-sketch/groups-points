import React, { useState, useRef, useEffect } from 'react';
import { Team, PerformanceStatus } from '../types';
import { ConnectedScoreBars } from './ConnectedScoreBars';
import { Check, X, Trophy, Edit2 } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  isSelected: boolean;
  maxScale: number;
  isCompact?: boolean;
  isLeader?: boolean;
  flashType: 'correct' | 'incorrect' | null;
  onSelect: (id: number) => void;
  onAddPoint: (id: number) => void;
  onSubtractPoint: (id: number) => void;
  onRename: (id: number, newName: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  isSelected,
  maxScale,
  isCompact = false,
  isLeader,
  flashType,
  onSelect,
  onAddPoint,
  onSubtractPoint,
  onRename,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(team.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNameValue(team.name);
  }, [team.name]);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (trimmed.length > 0) {
      onRename(team.id, trimmed);
    } else {
      setNameValue(team.name);
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setNameValue(team.name);
      setIsEditingName(false);
    }
  };

  const netScore = team.netScore;
  let performanceStatus: PerformanceStatus = 'TIED';
  let emojiFace = '😐';
  let statusLabel = 'TIED';
  let cardThemeStyles = '';
  let statusBadgeStyles = '';

  if (netScore > 0) {
    performanceStatus = 'WINNING';
    emojiFace = '😊';
    statusLabel = 'WINNING';
    // Predominantly green background
    cardThemeStyles = isSelected
      ? 'bg-gradient-to-br from-emerald-950 via-emerald-900/80 to-slate-950 border-emerald-400 ring-4 ring-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.4)]'
      : 'bg-gradient-to-br from-emerald-950/70 via-emerald-900/40 to-slate-900/90 border-emerald-700/60 hover:border-emerald-500 hover:shadow-[0_4px_25px_rgba(16,185,129,0.25)]';
    statusBadgeStyles = 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400';
  } else if (netScore < 0) {
    performanceStatus = 'LOSING';
    emojiFace = '😟';
    statusLabel = 'LOSING';
    // Predominantly red background
    cardThemeStyles = isSelected
      ? 'bg-gradient-to-br from-rose-950 via-rose-900/80 to-slate-950 border-rose-400 ring-4 ring-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.4)]'
      : 'bg-gradient-to-br from-rose-950/70 via-rose-900/40 to-slate-900/90 border-rose-800/60 hover:border-rose-500 hover:shadow-[0_4px_25px_rgba(244,63,94,0.25)]';
    statusBadgeStyles = 'bg-rose-950/90 border-rose-500/50 text-rose-400';
  } else {
    performanceStatus = 'TIED';
    emojiFace = '😐';
    statusLabel = 'TIED';
    // Neutral dark/gray theme
    cardThemeStyles = isSelected
      ? 'bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-950 border-slate-300 ring-4 ring-slate-400/50 shadow-[0_0_30px_rgba(148,163,184,0.3)]'
      : 'bg-gradient-to-br from-slate-900/90 via-slate-850 to-slate-950 border-slate-700/70 hover:border-slate-500 shadow-md';
    statusBadgeStyles = 'bg-slate-800/90 border-slate-600/50 text-slate-300';
  }

  let flashClass = '';
  if (flashType === 'correct') flashClass = 'animate-flash-correct';
  if (flashType === 'incorrect') flashClass = 'animate-flash-incorrect';

  // Compact card view for sidebar/strip in Focus Mode
  if (isCompact) {
    return (
      <div
        onClick={() => onSelect(team.id)}
        className={`relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${cardThemeStyles} ${flashClass} ${
          isSelected
            ? 'scale-[1.03] ring-2 ring-amber-400 border-amber-400 z-10'
            : 'opacity-85 hover:opacity-100 hover:scale-[1.02]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`w-7 h-7 rounded-lg font-mono-numbers font-black text-xs flex items-center justify-center shrink-0 ${
              isSelected
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}
          >
            {team.id}
          </span>
          <div className="min-w-0">
            <div className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[90px] sm:max-w-[130px]">
              {team.name}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
              <span>{emojiFace}</span>
              <span className="font-semibold uppercase tracking-wider">{statusLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`font-mono-numbers font-black text-sm sm:text-base ${
              netScore > 0
                ? 'text-emerald-400'
                : netScore < 0
                ? 'text-rose-400'
                : 'text-slate-200'
            }`}
          >
            {netScore > 0 ? `+${netScore}` : netScore}
          </span>
        </div>
      </div>
    );
  }

  // Standard Grid Card View
  return (
    <div
      onClick={() => onSelect(team.id)}
      className={`relative flex flex-col justify-between rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200 cursor-pointer ${cardThemeStyles} ${flashClass} ${
        isSelected ? 'scale-[1.02] z-20' : 'scale-100 z-10'
      }`}
    >
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Key shortcut badge */}
          <div
            className={`flex items-center justify-center font-mono-numbers font-black rounded-xl shrink-0 transition-transform ${
              isSelected
                ? 'w-10 h-10 text-xl bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-md'
                : 'w-9 h-9 text-base bg-slate-800 text-slate-200 border border-slate-700'
            }`}
            title={`Press ${team.id} to focus`}
          >
            {team.id}
          </div>

          {/* Editable Team Name */}
          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={24}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-slate-950 text-white font-bold text-base px-2.5 py-1 rounded border border-amber-400 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="group/name flex items-center gap-2">
                <h3 className="font-display font-black text-lg sm:text-xl truncate tracking-tight text-white">
                  {team.name}
                </h3>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingName(true);
                  }}
                  className="opacity-0 group-hover/name:opacity-100 hover:text-amber-300 text-slate-400 p-0.5 transition-opacity"
                  title="Rename team"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Performance status & face */}
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border tracking-wider uppercase ${statusBadgeStyles}`}
              >
                <span className="text-sm">{emojiFace}</span>
                {statusLabel}
              </span>
              {isLeader && netScore > 0 && (
                <span className="text-xs font-extrabold text-amber-400 tracking-wider flex items-center gap-0.5">
                  <Trophy className="w-3.5 h-3.5" />
                  LEADER
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Large Net Score */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            NET SCORE
          </span>
          <span
            className={`font-mono-numbers font-black text-2xl sm:text-3xl tracking-tight ${
              netScore > 0
                ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                : netScore < 0
                ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.6)]'
                : 'text-slate-200'
            }`}
          >
            {netScore > 0 ? `+${netScore}` : netScore}
          </span>
        </div>
      </div>

      {/* Connected Score Bars */}
      <div className="my-3">
        <ConnectedScoreBars
          netScore={netScore}
          maxScale={maxScale}
          isFocusMode={false}
        />
      </div>

      {/* Action Buttons */}
      <div
        className="mt-3 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onAddPoint(team.id)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md transition-all border border-emerald-400/40 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>+ CORRECT (C)</span>
        </button>

        <button
          type="button"
          onClick={() => onSubtractPoint(team.id)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md transition-all border border-rose-400/40 cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[3]" />
          <span>− INCORRECT (N)</span>
        </button>
      </div>
    </div>
  );
};
