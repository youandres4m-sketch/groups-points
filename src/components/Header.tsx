import React from 'react';
import {
  RotateCcw,
  Undo2,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Users,
  Award,
  Sparkles,
  LayoutGrid,
  Focus,
} from 'lucide-react';

interface HeaderProps {
  teamCount: number;
  onSetTeamCount: (count: number) => void;
  canUndo: boolean;
  onUndo: () => void;
  onOpenResetConfirm: () => void;
  onOpenEditTeams: () => void;
  onOpenWinner: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  teamCount,
  onSetTeamCount,
  canUndo,
  onUndo,
  onOpenResetConfirm,
  onOpenEditTeams,
  onOpenWinner,
  isFullscreen,
  onToggleFullscreen,
  soundEnabled,
  onToggleSound,
  isFocusMode,
  onToggleFocusMode,
}) => {
  return (
    <header className="w-full bg-slate-900/90 border-b border-slate-800/80 px-3 sm:px-6 py-2.5 sm:py-3 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: App Title and Subtitle */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl tracking-tight text-white uppercase drop-shadow-sm">
              Classroom Team Challenge
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide mt-0.5">
            Choose Your Team. Earn Points. Win the Challenge!
          </p>
        </div>

        {/* Center: Team Count Selector (1-9) */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-400">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">TEAMS:</span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((count) => {
              const isActive = teamCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => onSetTeamCount(count)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono-numbers font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 ring-2 ring-amber-300 scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`Set to ${count} ${count === 1 ? 'team' : 'teams'}`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Compact Global Action Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Mode Toggle (Grid View vs Focus Mode) */}
          <button
            type="button"
            onClick={onToggleFocusMode}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              isFocusMode
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title={isFocusMode ? 'Switch to All Teams Grid view' : 'Switch to Focused Team view'}
          >
            {isFocusMode ? (
              <>
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">GRID VIEW</span>
              </>
            ) : (
              <>
                <Focus className="w-4 h-4" />
                <span className="hidden sm:inline">FOCUS MODE</span>
              </>
            )}
          </button>

          {/* Winner Standings / Podium */}
          <button
            type="button"
            onClick={onOpenWinner}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
            title="View current leader & standings"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">STANDINGS</span>
          </button>

          {/* Edit Teams */}
          <button
            type="button"
            onClick={onOpenEditTeams}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            title="Rename teams & edit roster"
          >
            <Users className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">EDIT TEAMS</span>
          </button>

          {/* Undo (Shortcut U) */}
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              canUndo
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300 hover:text-amber-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed opacity-50'
            }`}
            title="Undo last point action (Shortcut: U)"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">UNDO</span>
            <kbd className="hidden md:inline font-mono text-[10px] bg-slate-950 px-1 rounded text-slate-400">
              U
            </kbd>
          </button>

          {/* Reset Scores */}
          <button
            type="button"
            onClick={onOpenResetConfirm}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-bold transition-all cursor-pointer"
            title="Reset all team scores to zero"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Fullscreen Toggle (Shortcut F) */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Toggle Fullscreen (Shortcut: F)"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
