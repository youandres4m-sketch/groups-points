import React, { useState, useRef, useEffect } from 'react';
import { Team, PerformanceStatus } from '../types';
import { ConnectedScoreBars } from './ConnectedScoreBars';
import { Check, X, Edit2, LayoutGrid, Trophy, Flame } from 'lucide-react';

interface FocusedTeamViewProps {
  team: Team;
  maxScale: number;
  isLeader?: boolean;
  flashType: 'correct' | 'incorrect' | null;
  onAddPoint: (id: number) => void;
  onSubtractPoint: (id: number) => void;
  onRename: (id: number, newName: string) => void;
  onExitFocus: () => void;
}

export const FocusedTeamView: React.FC<FocusedTeamViewProps> = ({
  team,
  maxScale,
  isLeader,
  flashType,
  onAddPoint,
  onSubtractPoint,
  onRename,
  onExitFocus,
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

  // Performance status and dynamic emotional face
  const netScore = team.netScore;
  let status: PerformanceStatus = 'TIED';
  let emojiFace = '😐';
  let statusLabel = 'TIED';
  let themeContainerStyles = '';
  let netScoreColorStyles = '';

  if (netScore > 0) {
    status = 'WINNING';
    emojiFace = '😊';
    statusLabel = 'WINNING';
    // Predominantly green background, gradients, borders and glow
    themeContainerStyles =
      'bg-gradient-to-b from-emerald-950/80 via-emerald-900/60 to-slate-950/95 border-emerald-400/90 shadow-[0_0_60px_rgba(16,185,129,0.35)] ring-4 ring-emerald-500/40';
    netScoreColorStyles =
      'text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.8)]';
  } else if (netScore < 0) {
    status = 'LOSING';
    emojiFace = '😟';
    statusLabel = 'LOSING';
    // Predominantly red background, gradients, borders and glow
    themeContainerStyles =
      'bg-gradient-to-b from-rose-950/80 via-rose-900/60 to-slate-950/95 border-rose-400/90 shadow-[0_0_60px_rgba(244,63,94,0.35)] ring-4 ring-rose-500/40';
    netScoreColorStyles =
      'text-rose-400 drop-shadow-[0_0_25px_rgba(251,113,133,0.8)]';
  } else {
    status = 'TIED';
    emojiFace = '😐';
    statusLabel = 'TIED';
    // Neutral dark/gray theme
    themeContainerStyles =
      'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-slate-600/80 shadow-[0_0_40px_rgba(148,163,184,0.2)] ring-4 ring-slate-600/30';
    netScoreColorStyles = 'text-slate-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]';
  }

  let flashClass = '';
  if (flashType === 'correct') flashClass = 'animate-flash-correct';
  if (flashType === 'incorrect') flashClass = 'animate-flash-incorrect';

  return (
    <div
      className={`w-full h-full min-h-[460px] lg:min-h-[520px] rounded-3xl border-3 p-5 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${themeContainerStyles} ${flashClass}`}
    >
      {/* Top Bar inside Focused Card */}
      <div className="flex items-start justify-between gap-4 z-10">
        {/* Left: Keyboard Key Badge + Team Name */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Prominent Shortcut Badge */}
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-400 text-slate-950 font-mono-numbers font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/30 ring-2 ring-amber-300"
            title={`Shortcut key: ${team.id}`}
          >
            {team.id}
          </div>

          {/* Editable Team Name */}
          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={24}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyDown}
                  className="w-full max-w-md bg-slate-950/90 text-white font-black text-2xl sm:text-4xl px-3 py-1.5 rounded-xl border-2 border-amber-400 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  title="Save name"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="group/name flex items-center gap-3">
                <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight truncate drop-shadow-md">
                  {team.name}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="opacity-60 group-hover/name:opacity-100 hover:text-amber-300 text-slate-400 p-1 transition-opacity cursor-pointer"
                  title="Rename team"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Status and Leader Badge */}
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase px-3 py-1 rounded-full bg-slate-950/70 border border-white/20">
                STATUS: {statusLabel}
              </span>
              {isLeader && netScore > 0 && (
                <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1 bg-amber-950/70 border border-amber-500/40 px-3 py-1 rounded-full">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  LEADER
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Return to Grid View Button & Selected Team Label */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs sm:text-sm font-black tracking-widest px-3 sm:px-4 py-1 rounded-full uppercase shadow-md shadow-amber-400/20">
              FOCUS MODE
            </span>
            <button
              type="button"
              onClick={onExitFocus}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 text-xs font-bold transition-all cursor-pointer shadow-md"
              title="Return to All Teams Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Center Hero: Massive Score & Dynamic Emotional Face */}
      <div className="my-4 sm:my-6 flex flex-col items-center justify-center gap-2 text-center">
        {/* Large Emotional Face */}
        <div
          className="text-6xl sm:text-7xl md:text-8xl select-none filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transform hover:scale-110 transition-transform cursor-default animate-in zoom-in-75 duration-200"
          title={`Performance face: ${statusLabel}`}
        >
          {emojiFace}
        </div>

        {/* Extra-Large Net Score Display */}
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-300/80 mb-1">
            CURRENT NET SCORE
          </span>
          <div
            className={`font-mono-numbers font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight ${netScoreColorStyles}`}
          >
            {netScore > 0 ? `+${netScore}` : netScore}
          </div>
        </div>
      </div>

      {/* Enlarged Connected Score Bars */}
      <div className="w-full max-w-4xl mx-auto my-2 sm:my-4">
        <ConnectedScoreBars
          netScore={netScore}
          maxScale={maxScale}
          isFocusMode={true}
        />
      </div>

      {/* Giant Clickable Action Buttons (+ CORRECT / - INCORRECT) */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-2 gap-3 sm:gap-6 mt-4 z-10">
        <button
          type="button"
          onClick={() => onAddPoint(team.id)}
          className="flex items-center justify-center gap-3 py-4 sm:py-5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-lg sm:text-2xl tracking-wide shadow-xl shadow-emerald-950/80 transition-all border-2 border-emerald-300/60 cursor-pointer"
        >
          <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3.5]" />
          <span>+ CORRECT (C)</span>
        </button>

        <button
          type="button"
          onClick={() => onSubtractPoint(team.id)}
          className="flex items-center justify-center gap-3 py-4 sm:py-5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-black text-lg sm:text-2xl tracking-wide shadow-xl shadow-rose-950/80 transition-all border-2 border-rose-300/60 cursor-pointer"
        >
          <X className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3.5]" />
          <span>− INCORRECT (N)</span>
        </button>
      </div>
    </div>
  );
};
