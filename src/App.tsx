import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Team, ScoreAction } from './types';
import {
  loadScoreboardState,
  saveScoreboardState,
} from './utils/storage';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { TeamCard } from './components/TeamCard';
import { FocusedTeamView } from './components/FocusedTeamView';
import { KeyboardGuide } from './components/KeyboardGuide';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { EditTeamsModal } from './components/EditTeamsModal';
import { WinnerModal } from './components/WinnerModal';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [initialData] = useState(() => loadScoreboardState());

  const [teamCount, setTeamCount] = useState<number>(initialData.teamCount);
  const [teams, setTeams] = useState<Team[]>(initialData.teams);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(
    initialData.selectedTeamId
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    initialData.soundEnabled
  );

  // Undo history stack
  const [history, setHistory] = useState<ScoreAction[]>([]);

  // Flash animation state for active team
  const [flashInfo, setFlashInfo] = useState<{
    teamId: number;
    type: 'correct' | 'incorrect';
  } | null>(null);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Alert message when C or N is pressed with no team selected
  const [promptMessage, setPromptMessage] = useState<string | null>(null);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync sound manager state
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Sync to localStorage
  useEffect(() => {
    saveScoreboardState({
      teamCount,
      teams,
      selectedTeamId,
      soundEnabled,
    });
  }, [teamCount, teams, selectedTeamId, soundEnabled]);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Shared maximum scale calculation based on highest absolute score
  const maxScale = useMemo(() => {
    let highest = 5; // Minimum default scale
    teams.forEach((t) => {
      const mag = Math.abs(t.netScore);
      if (mag > highest) highest = mag;
    });
    return highest;
  }, [teams]);

  // Performance category tallies & class net score
  const stats = useMemo(() => {
    let winning = 0;
    let tied = 0;
    let losing = 0;
    let totalNet = 0;

    teams.forEach((t) => {
      totalNet += t.netScore;
      if (t.netScore > 0) winning++;
      else if (t.netScore < 0) losing++;
      else tied++;
    });

    return { winning, tied, losing, totalNet };
  }, [teams]);

  // Leader calculation
  const leaderId = useMemo(() => {
    let topId = -1;
    let maxNet = 0;
    teams.forEach((t) => {
      if (t.netScore > maxNet) {
        maxNet = t.netScore;
        topId = t.id;
      }
    });
    return topId;
  }, [teams]);

  // Flash animation trigger
  const triggerFlash = (teamId: number, type: 'correct' | 'incorrect') => {
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }
    setFlashInfo({ teamId, type });
    flashTimerRef.current = setTimeout(() => {
      setFlashInfo(null);
    }, 350);
  };

  // Show temporary prompt toast
  const showPrompt = (msg: string) => {
    if (promptTimerRef.current) {
      clearTimeout(promptTimerRef.current);
    }
    setPromptMessage(msg);
    promptTimerRef.current = setTimeout(() => {
      setPromptMessage(null);
    }, 2500);
  };

  // Add Point (+1 to Net Score)
  const handleAddPoint = useCallback(
    (targetId?: number) => {
      const id = targetId ?? selectedTeamId;
      if (id === null || id === undefined) {
        showPrompt('Please select a team first (Press 1–9 or click a team card)');
        return;
      }

      setTeams((prev) => {
        const team = prev.find((t) => t.id === id);
        if (!team) return prev;

        const prevScore = team.netScore;
        const newScore = prevScore + 1;

        setHistory((h) => [
          ...h,
          {
            type: 'ADD_POINT',
            teamId: id,
            prevScore,
            newScore,
            timestamp: Date.now(),
          },
        ]);

        return prev.map((t) =>
          t.id === id ? { ...t, netScore: newScore } : t
        );
      });

      triggerFlash(id, 'correct');
      soundManager.playCorrect();
    },
    [selectedTeamId]
  );

  // Subtract Point (-1 from Net Score)
  const handleSubtractPoint = useCallback(
    (targetId?: number) => {
      const id = targetId ?? selectedTeamId;
      if (id === null || id === undefined) {
        showPrompt('Please select a team first (Press 1–9 or click a team card)');
        return;
      }

      setTeams((prev) => {
        const team = prev.find((t) => t.id === id);
        if (!team) return prev;

        const prevScore = team.netScore;
        const newScore = prevScore - 1;

        setHistory((h) => [
          ...h,
          {
            type: 'SUBTRACT_POINT',
            teamId: id,
            prevScore,
            newScore,
            timestamp: Date.now(),
          },
        ]);

        return prev.map((t) =>
          t.id === id ? { ...t, netScore: newScore } : t
        );
      });

      triggerFlash(id, 'incorrect');
      soundManager.playIncorrect();
    },
    [selectedTeamId]
  );

  // Select team & activate Focus Mode
  const handleSelectTeam = useCallback(
    (id: number) => {
      if (id >= 1 && id <= teamCount) {
        setSelectedTeamId(id);
        soundManager.playSelect();
      }
    },
    [teamCount]
  );

  // Exit Focus Mode (return to normal grid)
  const handleExitFocus = useCallback(() => {
    setSelectedTeamId(null);
  }, []);

  // Toggle View Mode (between Focus Mode and Grid View)
  const handleToggleFocusMode = useCallback(() => {
    if (selectedTeamId !== null) {
      setSelectedTeamId(null);
    } else {
      setSelectedTeamId(1);
    }
  }, [selectedTeamId]);

  // Undo Last Scoring Action
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];
    setTeams((prev) =>
      prev.map((t) =>
        t.id === lastAction.teamId
          ? {
              ...t,
              netScore: lastAction.prevScore,
            }
          : t
      )
    );

    // If undone team was not selected, select it so teacher sees the change
    setSelectedTeamId(lastAction.teamId);

    setHistory((prev) => prev.slice(0, -1));
    soundManager.playUndo();
  }, [history]);

  // Rename team directly
  const handleRenameTeam = useCallback((id: number, newName: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: newName } : t))
    );
  }, []);

  // Set Team Count
  const handleSetTeamCount = useCallback(
    (newCount: number) => {
      const clampedCount = Math.max(1, Math.min(9, newCount));
      setTeamCount(clampedCount);

      setTeams((prev) => {
        if (clampedCount <= prev.length) {
          return prev.slice(0, clampedCount);
        } else {
          const next = [...prev];
          for (let i = prev.length + 1; i <= clampedCount; i++) {
            next.push({
              id: i,
              name: `Team ${i}`,
              netScore: 0,
            });
          }
          return next;
        }
      });

      setSelectedTeamId((prev) => {
        if (prev === null) return null;
        return Math.min(prev, clampedCount);
      });
    },
    []
  );

  // Apply Changes from Edit Modal
  const handleSaveTeamsModal = useCallback(
    (newCount: number, updatedNames: Record<number, string>) => {
      const clampedCount = Math.max(1, Math.min(9, newCount));
      setTeamCount(clampedCount);

      setTeams((prev) => {
        const next: Team[] = [];
        for (let i = 1; i <= clampedCount; i++) {
          const existing = prev.find((t) => t.id === i);
          next.push({
            id: i,
            name: updatedNames[i]?.trim() || existing?.name || `Team ${i}`,
            netScore: existing ? existing.netScore : 0,
          });
        }
        return next;
      });

      setSelectedTeamId((prev) => {
        if (prev === null) return null;
        return Math.min(prev, clampedCount);
      });
    },
    []
  );

  // Reset all scores to 0
  const handleResetScores = useCallback(() => {
    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        netScore: 0,
      }))
    );
    setHistory([]);
    soundManager.playUndo();
  }, []);

  // Toggle Fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  // Global Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (isInputActive) {
        return;
      }

      if (e.repeat) {
        return;
      }

      const key = e.key;

      // Number keys 1 - 9: Select corresponding team & activate focus mode
      if (/^[1-9]$/.test(key)) {
        const targetTeamId = parseInt(key, 10);
        if (targetTeamId <= teamCount) {
          e.preventDefault();
          handleSelectTeam(targetTeamId);
        }
        return;
      }

      // C: +1 Correct
      if (key === 'c' || key === 'C') {
        e.preventDefault();
        handleAddPoint();
        return;
      }

      // N: -1 Incorrect
      if (key === 'n' || key === 'N') {
        e.preventDefault();
        handleSubtractPoint();
        return;
      }

      // U: Undo
      if (key === 'u' || key === 'U') {
        e.preventDefault();
        handleUndo();
        return;
      }

      // F: Fullscreen Toggle
      if (key === 'f' || key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
        return;
      }

      // Escape: Exit Focus mode back to grid if in focus mode
      if (key === 'Escape' && selectedTeamId !== null) {
        e.preventDefault();
        handleExitFocus();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    teamCount,
    selectedTeamId,
    handleSelectTeam,
    handleAddPoint,
    handleSubtractPoint,
    handleUndo,
    handleToggleFullscreen,
    handleExitFocus,
  ]);

  // Selected team object
  const focusedTeam = useMemo(() => {
    if (selectedTeamId === null) return null;
    return teams.find((t) => t.id === selectedTeamId) || null;
  }, [teams, selectedTeamId]);

  // Responsive Grid Layout Logic for normal grid view
  const getGridClasses = () => {
    switch (teamCount) {
      case 1:
        return 'grid-cols-1 max-w-2xl mx-auto';
      case 2:
        return 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto';
      case 3:
        return 'grid-cols-1 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto';
      case 5:
      case 6:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 7:
      case 8:
      case 9:
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Top Header Section */}
      <Header
        teamCount={teamCount}
        onSetTeamCount={handleSetTeamCount}
        canUndo={history.length > 0}
        onUndo={handleUndo}
        onOpenResetConfirm={() => setIsResetModalOpen(true)}
        onOpenEditTeams={() => setIsEditModalOpen(true)}
        onOpenWinner={() => setIsWinnerModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        isFocusMode={selectedTeamId !== null}
        onToggleFocusMode={handleToggleFocusMode}
      />

      {/* Floating Alert Prompt Banner */}
      {promptMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-amber-300 animate-in fade-in slide-in-from-top-4 duration-150">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{promptMessage}</span>
        </div>
      )}

      {/* Main Scoreboard Arena */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 flex flex-col justify-center">
        {focusedTeam ? (
          /* ========================================================
             1. FULL-SCREEN FOCUS MODE (Selected Team ~80-90% area)
             ======================================================== */
          <div className="w-full h-full flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Primary Focus Card (Dominates screen) */}
            <div className="flex-1 min-w-0">
              <FocusedTeamView
                team={focusedTeam}
                maxScale={maxScale}
                isLeader={focusedTeam.id === leaderId}
                flashType={
                  flashInfo?.teamId === focusedTeam.id ? flashInfo.type : null
                }
                onAddPoint={handleAddPoint}
                onSubtractPoint={handleSubtractPoint}
                onRename={handleRenameTeam}
                onExitFocus={handleExitFocus}
              />
            </div>

            {/* Compact Sidebar / Strip for Remaining Teams */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Roster ({teamCount})</span>
                <span className="text-[11px] text-amber-400">Click to switch</span>
              </div>

              {/* Scrollable container for roster */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 overflow-y-auto max-h-[220px] lg:max-h-[520px] p-0.5">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    isSelected={team.id === selectedTeamId}
                    maxScale={maxScale}
                    isCompact={true}
                    isLeader={team.id === leaderId}
                    flashType={
                      flashInfo?.teamId === team.id ? flashInfo.type : null
                    }
                    onSelect={handleSelectTeam}
                    onAddPoint={handleAddPoint}
                    onSubtractPoint={handleSubtractPoint}
                    onRename={handleRenameTeam}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             2. ALL TEAMS NORMAL GRID VIEW (No team focused)
             ======================================================== */
          <div
            className={`grid gap-3 sm:gap-4 lg:gap-5 w-full items-stretch transition-all duration-300 ${getGridClasses()}`}
          >
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                isSelected={false}
                maxScale={maxScale}
                isCompact={false}
                isLeader={team.id === leaderId}
                flashType={
                  flashInfo?.teamId === team.id ? flashInfo.type : null
                }
                onSelect={handleSelectTeam}
                onAddPoint={handleAddPoint}
                onSubtractPoint={handleSubtractPoint}
                onRename={handleRenameTeam}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Keyboard Guide & Statistics */}
      <KeyboardGuide
        totalTeams={teamCount}
        selectedTeamId={selectedTeamId}
        winningCount={stats.winning}
        tiedCount={stats.tied}
        losingCount={stats.losing}
        classNetScore={stats.totalNet}
      />

      {/* Confirmation & Feature Modals */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetScores}
      />

      <EditTeamsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teams={teams}
        teamCount={teamCount}
        onSave={handleSaveTeamsModal}
      />

      <WinnerModal
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        teams={teams}
      />
    </div>
  );
}
